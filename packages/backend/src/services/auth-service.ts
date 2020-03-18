import { Request, Response } from 'express';
import { getAuthUser, deleteAuthCookie, setAuthCookie } from '../auth-helper';
import { Identity } from '../entities/identity';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import Joi from '@hapi/joi';
import { hash, verify } from 'argon2';

export class AuthService {
  static async getLoginStatus(req: Request, res: Response): Promise<void> {
    const identity: Identity | null = await getAuthUser(req);
    if (identity !== null) {
      res.status(200).json(identity);
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }

  static async login(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity !== null) {
      res.json({ message: 'Already logged in', identity });
      return;
    }
    const requiredProperties = ['name', 'password'];
    requiredProperties.forEach(prop => {
      if (!req.body[prop]) {
        res.status(403).json({ error: prop + ' missing' });
        return;
      }
    });
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        name: req.body.name
      });
      if (!user || !user.name || !user.fullName || !user.passwordHash) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const password = req.body.password;

      const passwordValid = await verify(user.passwordHash, password);
      if (!passwordValid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await setAuthCookie(res, user.name, user.fullName, user.role);
      res.json({ message: 'ok', name: user.name, fullName: user.fullName });
    } catch (ex) {
      res.status(401).json({ error: ex.message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity !== null) {
      deleteAuthCookie(res);
      res.status(200).json({ message: 'ok' });
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }

  static async signup(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity !== null) {
      res
        .status(401)
        .json({ error: 'Signup process unavailable when already logged in.' });
      return;
    }
    try {
      const userRepo = getRepository(User);
      const user = new User();
      const userSchema = Joi.object({
        name: Joi.string()
          .trim()
          .min(3)
          .pattern(/^[a-z]([a-z0-9_]+)$/)
          .lowercase()
          .required(),
        fullName: Joi.string()
          .trim()
          .allow('', null)
          .optional(),
        email: Joi.string()
          .trim()
          .email()
          .required(),
        password: Joi.string()
          .trim()
          .min(6)
          .required(),
        location: Joi.string()
          .trim()
          .allow('', null)
          .optional(),
        twitterHandle: Joi.string()
          .trim()
          .allow('', null)
          .optional(),
        githubUser: Joi.string()
          .trim()
          .allow('', null)
          .optional(),
        description: Joi.string()
          .trim()
          .allow('', null)
          .optional()
      });
      const form = await userSchema.validate(req.body);
      if (form.error) {
        res.status(400).json({ error: 'Bad request', details: form.error });
        return;
      }
      // check if user.name already exists
      const userCount = await userRepo.count({ name: form.value.name });
      if (userCount > 0) {
        res.status(403).json({ error: 'User already exists.' });
        return;
      }
      user.name = form.value.name.toLowerCase();
      user.fullName = form.value.fullName;
      user.email = form.value.email;
      user.passwordHash = await hash(form.value.password);
      user.githubUser = form.value.githubUser || '';
      user.location = form.value.location || '';
      user.twitterHandle = form.value.twitterHandle || '';
      user.description = '';
      await userRepo.insert(user);
      res.json({ message: 'ok' });
    } catch (ex) {
      console.log(ex);
      res.status(403).json({ error: ex.message });
    }
  }
}
