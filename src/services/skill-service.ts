import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Skill } from '../entities/skill';
import { getAuthUser } from '../auth-helper';
import Joi from '@hapi/joi';

export class SkillService {

  static async getSkills(req: Request, res: Response): Promise<void> {
    try {
      const skillRepo = getRepository(Skill);
      const skills = await skillRepo.find();
      res.json(skills.map(({name, homepage, description}) => ({name, homepage, description})));
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async addSkill(req: Request, res: Response): Promise<void> {
    const user = await getAuthUser(req);
    if (! user) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    let form = null;
    if (req.body) {
      try {
        const skillScheme = Joi.object({
          name: Joi.string().trim().lowercase().required(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional() 
        });
        form = await skillScheme.validate(req.body);
      } catch (ex) {
      }
    }
    if ((!form) || form.error) {
      res.status(400).json({error: 'Bad request', details: form?.error});
      return;
    }
    try {
      const skillRepo = getRepository(Skill);
      const skill = new Skill();
      skill.name = form.value.name;
      skill.homepage = form.value.homepage;
      skill.description = form.value.description;
      const count = await skillRepo.count({name: skill.name}); 
      if (count > 0) {
        res.status(403).json({error: 'Skill already exists'});
        return;
      }
      await skillRepo.insert(skill);
      res.json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async updateSkill(req: Request, res: Response): Promise<void> {
    const skillName = req.params.name;
    const identity = await getAuthUser(req);
    if (! identity) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    try {
      const skillRepo = getRepository(Skill);
      const skill = await skillRepo.findOne({name: skillName});
      if (! skill) {
        res.status(404).json({error: 'Skill not found'});
        return;
      }
      const skillScheme = Joi.object({
        homepage: Joi.string().trim().min(3).lowercase().uri().allow('', null).optional(),
        description: Joi.string().trim().allow('', null).optional()
      });
      let form = null;
      if (req.body) {
        form = await skillScheme.validate(req.body);
      }
      if ((!form) || form.error) {
        res.status(400).json({error: 'Bad request', details: form?.error});
        return;
      }
      if (form.value.homepage) {
        skill.homepage = form.value.homepage;
      }
      if (form.value.description) {
        skill.description = form.value.description;
      }
      await skillRepo.save(skill);
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

  static async deleteSkill(req: Request, res: Response): Promise<void> {
    const skillName = req.params.name;
    const identity = await getAuthUser(req);
    if (! identity) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    try {
      const skillRepo = getRepository(Skill);
      const deleteResult = await skillRepo.delete({ name: skillName });
      if (deleteResult.affected === 0) {
        res.status(404).json({error: 'Skill not found'});
        return;
      }
      res.status(200).json({message: 'ok'});
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }
}
