import { Request, Response } from 'express';
import { getAuthUser, deleteAuthCookie, setAuthCookie } from '../auth-helper';
import { User } from '../entities/user';

import Joi from 'joi';
import { UserSkill } from '../entities/user-skill';
import { hash } from 'argon2';
import { AppDataSource } from '../data-source';

export class UserService {
  static async getUser(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity === null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userName = req.params.name;
    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneOrFail({ where: {name: userName }});
      const reducedSet = {
        name: user.name,
        fullName: user.fullName,
        location: user.location,
        company: user.company,
        githubUser: user.githubUser,
        twitterHandle: user.twitterHandle,
        homepage: user.homepage,
        description: user.description,
        pronouns: user.pronouns,
        role: user.role,
      };
      if (user.name === identity.name) {
        res.status(200).json({
          ...reducedSet,
          email: user.email,
        });
        return;
      }
      res.json(reducedSet);
    } catch (ex: any) {
      if (ex.name === 'EntityNotFound') {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const identity = await getAuthUser(req);
      const userName = req.params.name.toLowerCase();
      if (identity === null || identity.name !== userName) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: [{ name: userName }],
      });
      if (!user) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const userSchema = Joi.object({
        name: Joi.string()
          .trim()
          .min(3)
          .pattern(/^[a-z]([a-z0-9_]+)$/)
          .lowercase()
          .allow('', null)
          .optional(),
        fullName: Joi.string().trim().min(2).allow('', null).optional(),
        email: Joi.string().trim().email().min(6).optional(),
        company: Joi.string().trim().allow('', null).optional(),
        password: Joi.string().trim().min(6).optional(),
        location: Joi.string().trim().allow('', null).optional(),
        description: Joi.string().trim().allow('', null).optional(),
        twitterHandle: Joi.string().trim().allow('', null).optional(),
        githubUser: Joi.string().trim().allow('', null).optional(),
        homepage: Joi.string().trim().allow('', null).optional(),
        pronouns: Joi.string().trim().allow('', null).optional(),
        role: Joi.string().trim().allow('', null).optional(),
      });
      const form = await userSchema.validate(req.body);
      let usernameChanged = false;
      if (form.error) {
        res.status(400).json({ error: 'Bad request', details: form.error });
        return;
      }
      if (form.value.name && user.name !== form.value.name) {
        usernameChanged = true;
        user.name = form.value.name;
      }
      if (form.value.fullName) {
        user.fullName = form.value.fullName;
      }
      if (form.value.email) {
        user.email = form.value.email;
      }
      user.description = form.value.description || '';
      user.githubUser = form.value.githubUser || '';
      user.location = form.value.location || '';
      user.company = form.value.company || '';
      user.twitterHandle = form.value.twitterHandle || '';
      user.pronouns = form.value.pronouns || '';
      user.homepage = form.value.homepage || '';
      if (identity.role === 'admin' && form.value.role) {
        user.role = form.value.role;
      }
      if (form.value.password) {
        user.passwordHash = await hash(form.value.password);
      }
      await userRepo.save(user);
      if (usernameChanged) {
        await setAuthCookie(
          res,
          user.name || '',
          user.fullName || '',
          user.role
        );
      }
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userName = req.params.name.toLowerCase();
      const identity = await getAuthUser(req);
      if (identity === null || identity.name !== userName) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const userRepo = AppDataSource.getRepository(User);
      const deleteResult = await userRepo.delete({ name: userName });
      if (deleteResult.affected === 0) {
        res.status(404).json({ error: 'Not found' });
      }
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      await userSkillRepo.delete({ userName });
      deleteAuthCookie(res);
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async getUserSkills(req: Request, res: Response): Promise<void> {
    const userName = req.params.name.toLowerCase();
    try {
      const identity = await getAuthUser(req);
      if (identity === null) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const userRepo = AppDataSource.getRepository(User);
      const count = await userRepo.count({where: { name: userName }});
      if (count === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      const skills = await userSkillRepo.find({
        where: {userName},
      });
      res.status(200).json(skills);
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async addUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name.toLowerCase();
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const userRepo = AppDataSource.getRepository(User);
      const userCount = await userRepo.count({where: { name: userName }});
      if (userCount === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const skillScheme = Joi.object({
        skillName: Joi.string().trim().required(),
        skillLevel: Joi.number().required(),
        willLevel: Joi.number().required(),
      });
      const form = await skillScheme.validate(req?.body || {});
      if (!form || form.error) {
        res.status(400).json({ error: 'Bad request', details: form.error });
        return;
      }
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      const count = await userSkillRepo.count({where: {
        userName,
        skillName: form.value.skillName,
      }});
      if (count > 0) {
        res.status(403).json({ error: 'Skill already exists' });
        return;
      }
      const newSkill = new UserSkill();
      newSkill.userName = userName;
      newSkill.skillName = form.value.skillName;
      newSkill.skillLevel = form.value.skillLevel;
      newSkill.willLevel = form.value.willLevel;
      await userSkillRepo.insert(newSkill);
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async updateUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name.toLowerCase();
    const skillName = req.params.skillName;
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      const skill = await userSkillRepo.findOne({where: {
        userName,
        skillName,
      }});
      if (!skill) {
        res.status(404).json({ error: 'Skill not found' });
        return;
      }
      const skillScheme = Joi.object({
        skillLevel: Joi.number().required(),
        willLevel: Joi.number().required(),
      });
      const form = await skillScheme.validate(req.body || {});
      if (!form || form.error) {
        res.status(400).json({ error: 'Bad request', details: form.error });
        return;
      }
      skill.skillLevel = form.value.skillLevel;
      skill.willLevel = form.value.willLevel;
      await userSkillRepo.save(skill);
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async deleteUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name;
    const skillName = req.params.skillName;
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      const deleteResult = await userSkillRepo.delete({
        userName,
        skillName,
      });
      if (deleteResult.affected === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
