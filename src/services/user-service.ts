import { Request, Response } from 'express';
import { getAuthUser, deleteAuthCookie, setAuthCookie } from '../auth-helper';
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import { hash } from '../security-helpers';
import Joi from '@hapi/joi';
import { UserSkill } from '../entities/user-skill';

export class UserService {

  static async getUser(req: Request, res: Response): Promise<void> {
    const identity = await getAuthUser(req);
    if (identity === null) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const userName = req.params.name;
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOneOrFail({name: userName});
      res.json({
        name: user.name,
        fullName: user.fullName,
        location: user.location,
        githubUser: user.githubUser,
        twitterHandle: user.twitterHandle,
        description: user.description
      });
    } catch(ex) {
      if (ex.name === 'EntityNotFound') {
        res.status(404).json({error: 'Not found'});
        return;
      }
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const identity = await getAuthUser(req);
      const userName = req.params.name;
      if (identity === null || identity.name !== userName) {
        res.status(401).json({error: 'Unauthorized'});
        return;
      }
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: [{name: userName}]
      });
      if (!user) {
        res.status(404).json({error: 'Not found'})
        return;
      }
      const userSchema = Joi.object({
        name: Joi.string().min(3).lowercase().optional(),
        fullName: Joi.string().min(2).optional(),
        email: Joi.string().email().min(6).optional(),
        password: Joi.string().min(6).optional(),
        location: Joi.string().optional(),
        description: Joi.string().optional(),
        twitterHandle: Joi.string().optional(),
        githubUser: Joi.string().optional()
      });
      const form = await userSchema.validate(req.body);
      if (form.error) {
        res.status(400).json({error: 'Bad request', details: form.error});
        return;
      }
      if (form.value.name) {
        user.name = form.value.name;
      }
      if (form.value.fullName) {
        user.fullName = form.value.fullName;
      }
      if (form.value.email) {
        user.email = form.value.email;
      }
      if (form.value.description) {
        user.description = form.value.description;
      }
      if (form.value.githubUser) {
        user.githubUser = form.value.githubUser;
      }
      if (form.value.location) {
        user.location = form.value.location;
      }
      if (form.value.twitterHandle) {
        user.twitterHandle = form.value.twitterHandle;
      }
      if (req.body.password) {
        user.passwordHash = hash(form.value.password);
      }
      await userRepo.save(user);
      await setAuthCookie(res, user.name || '', user.fullName || '');
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userName = req.params.name;
      const identity = await getAuthUser(req);
      if (identity === null || identity.name !== userName) {
        res.status(401).json({error: 'Unauthorized'});
        return;
      }
      const userRepo = getRepository(User);
      const deleteResult = await userRepo.delete({name: userName});
      if (deleteResult.affected === 0) {
        res.status(404).json({error: 'Not found'});
      }
      const userSkillRepo = getRepository(UserSkill); 
      const deleteSkillResult = await userSkillRepo.delete({userName})
      deleteAuthCookie(res);
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async getUserSkills(req: Request, res: Response): Promise<void> {
    const userName = req.params.name;
    try {
      const identity = await getAuthUser(req);
      if (identity === null) {
        res.status(401).json({error: 'Unauthorized'});
        return;
      }
      const userRepo = getRepository(User);
      const count = await userRepo.count({name: userName});
      if (count === 0) {
        res.status(404).json({error: 'Not found'});
        return;
      }
      const userSkillRepo = getRepository(UserSkill);
      const skills = await userSkillRepo.find({
        userName
      });
      res.status(200).json(skills);
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async addUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name;
    const skillName = req.body.skillName;
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    try {
      const userRepo = getRepository(User);
      const userSkillRepo = getRepository(UserSkill);
      const user = await userRepo.findOne({name: userName});
      if (!user) {
        res.status(404).json({error: 'Not found'});
        return;
      }
      const existingSkill = await userSkillRepo.findOne({
        userName, skillName
      });
      if (existingSkill) {
        existingSkill.skillLevel = req.body.skillLevel;
        existingSkill.willLevel = req.body.willLevel;
        await userSkillRepo.save(existingSkill);
      } else {
        const newSkill = new UserSkill();
        newSkill.userName = userName;
        newSkill.skillName = skillName;
        newSkill.skillLevel = req.body.skillLevel;
        newSkill.willLevel = req.body.willLevel;
        await userSkillRepo.save(newSkill);
      }
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }  
  }
  
  static async updateUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name;
    const skillName = req.body.skillName;
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    try {
      const userSkillRepo = getRepository(UserSkill);
      const skill = await userSkillRepo.findOne({
        userName, skillName
      });
      if (! skill) {
        res.status(404).json({error: 'Skill not found'});
        return;
      }
      const skillScheme = Joi.object({
        skillLevel: Joi.number().required(),
        willLevel: Joi.number().required()
      });
      const form = await skillScheme.validate(req.body);
      skill.skillLevel = form.value.skillLevel;
      skill.willLevel = form.value.willLevel;
      await userSkillRepo.save(skill);
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async deleteUserSkill(req: Request, res: Response): Promise<void> {
    const userName = req.params.name;
    const skillName = req.body.skillName;
    const identity = await getAuthUser(req);
    if (identity === null || userName !== identity.name) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    try {
      const userSkillRepo = getRepository(UserSkill);
      const deleteResult = await userSkillRepo.delete({
        userName, skillName
      });
      if (deleteResult.affected === 0) {
        res.status(404).json({message: 'Not found'});
        return;  
      }
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }


}