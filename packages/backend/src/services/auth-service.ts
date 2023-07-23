import { Request, Response } from 'express';
import Joi from 'joi';
import { hash, verify } from 'argon2';
import fetch from 'cross-fetch';

import { getAuthUser, deleteAuthCookie, setAuthCookie, getAuthUserFromKey } from '../auth-helper';
import { Identity, createIdentity } from '../entities/identity';

import { User } from '../entities/user';
import { AppDataSource } from '../data-source';
import { jwtSign } from '../security-helpers';
import { email } from '../email';
import { TPL_FORGOT } from '../email-templates';

export class AuthService {
  static async getLoginStatus(req: Request, res: Response): Promise<void> {
    const identity: Identity | null = await getAuthUser(req);
    if (identity !== null) {
      res.status(200).json(identity);
      return;
    }
    res.status(401).json({ error: 'Unauthorized' });
  }

  static async getAuthProviders(_req: Request, res: Response): Promise<void> {
    const providers: Array<{provider: string, url: string}> = [];
    if (process.env.GITHUB_CLIENT_ID) {
      providers.push({
        provider: 'GitHub', 
        url: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
      });
    }
    res.status(200).json({
      providers
    });
  }

  static async login(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity !== null) {
      res.json({ message: 'Already logged in', identity });
      return;
    }
    const requiredProperties = ['name', 'password'];
    requiredProperties.forEach((prop) => {
      if (!req.body[prop]) {
        res.status(403).json({ error: prop + ' missing' });
        return;
      }
    });
    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: {name: req.body.name},
      });
      if (!user || !user.name || !user.passwordHash) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const password = req.body.password;

      const passwordValid = await verify(user.passwordHash, password);
      if (!passwordValid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await setAuthCookie(
        res,
        user.name,
        user.fullName || user.name,
        user.role
      );
      res.json({ message: 'ok', name: user.name, fullName: user.fullName });
    } catch (ex: any) {
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
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      const userSchema = Joi.object({
        name: Joi.string()
          .trim()
          .min(3)
          .pattern(/^[a-z]([a-z0-9_]+)$/)
          .lowercase()
          .required(),
        fullName: Joi.string().trim().allow('', null).optional(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).required(),
        location: Joi.string().trim().allow('', null).optional(),
        twitterHandle: Joi.string().trim().allow('', null).optional(),
        githubUser: Joi.string().trim().allow('', null).optional(),
        homepage: Joi.string().trim().allow('', null).optional(),
        description: Joi.string().trim().allow('', null).optional(),
      });
      const form = userSchema.validate(req.body);
      if (form.error) {
        res.status(400).json({ error: 'Bad request', details: form.error });
        return;
      }
      // check if user.name already exists
      const userCount = await userRepo.count({ where: {name: form.value.name }});
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
      user.homepage = form.value.homepage || '';
      user.description = '';
      await userRepo.insert(user);
      res.json({ message: 'ok' });
    } catch (ex: any) {
      console.log(ex);
      res.status(403).json({ error: ex.message });
    }
  }

  static async loginViaGithub(req: Request, res: Response): Promise<void> {
    const identity: Identity | null = await getAuthUser(req);
    if (identity !== null) {
      res.redirect('/');
      return;
    }
    try {
      const code = req.query.code;
      const data = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      };
      const authRequest = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const authResponse: any = await authRequest.json();
      const accessToken = authResponse.access_token;
      const apiRequest = await fetch('https://api.github.com/user', {
        headers: {
          Accept: 'application/json',
          Authorization: 'token ' + accessToken,
        },
      });
      const apiResponse: any = await apiRequest.json();
      const githubUser = apiResponse.login;
      if (!githubUser) {
        res.redirect('/');
        return;
      }
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: githubUser });
      if (user && user.name) {
        await setAuthCookie(
          res,
          user.name,
          user.fullName || user.name,
          user.role
        );
        res.status(302).redirect('/');
        return;
      }
      // There's no registered user having that github account.
      // So, create a new user.
      const userData: User = {
        name: githubUser,
        fullName: apiResponse.name,
        email: apiResponse.email || githubUser + '@example.org',
        description: apiResponse.bio,
        location: apiResponse.location,
        company: apiResponse.company,
        twitterHandle: '',
        githubUser,
      };
      // check if user.name already exists
      let suffix = NaN;
      while ((await userRepo.count({ where: {name: userData.name }})) > 0) {
        if (isNaN(suffix)) {
          suffix = 0;
        }
        suffix += 1;
        userData.name = githubUser + '_' + suffix;
      }
      if (!userData.name) {
        res.redirect('/');
        return;
      }
      await userRepo.insert(userData);
      await setAuthCookie(
        res,
        userData.name || '',
        userData.fullName || userData.name,
        userData.role
      );
      res.redirect('/my-profile');
      return;
    } catch (ex: any) {
      res.status(500).json({ error: ex.message });
    }
  }

  // sends a login link via Email.
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const identity: Identity | null = await getAuthUser(req);
    if (identity !== null) {
      res.redirect('/');
      return;
    }
    const userRepo = AppDataSource.getRepository<User>(User);
    const user = await userRepo.findOne({
      where: {name: req.body.name, email: req.body.email},
    });
    
    if (user && user.name && user.email) {
      const loginExpiresIn = process.env.LOGIN_LINK_EXPIRE || '15m';
      const tempIdentity = createIdentity(user.name || '', user.fullName || '', user.role || '');
      const tempLogin: string = await jwtSign(tempIdentity, {expiresIn: loginExpiresIn});
      await email({
        from: process.env.EMAIL_FROM || 'lea@talentbook.local',
        to: user.email,
        ...TPL_FORGOT(tempLogin, loginExpiresIn)
      });
    }
    res.send({message: 'Link sent in case there is an account associated with this username/email combination.'});
  }

  static async tempLogin(req: Request, res: Response): Promise<void> {
    if (!req.query.key) {
      res.redirect('/');
      return;
    }
    try {
      const identity = <Identity>await getAuthUserFromKey(req.query.key.toString());
      await setAuthCookie(
        res,
        identity.name || '',
        identity.fullName || identity.name,
        identity.role || 'user'
      );
    } catch (err) {
      console.error(err);
    } finally {
      res.redirect('/');
    }
  }
}
