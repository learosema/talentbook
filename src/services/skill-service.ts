import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Skill } from '../entities/skill';
import { getAuthUser } from '../auth-helper';
import Joi from '@hapi/joi';

export class SkillService {

  static async getSkills(req: Request, res: Response): Promise<void> {
    try {
      const skillRepo = getRepository(Skill);
      const skills: Skill[] = await skillRepo.find();
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
    try {
      const skillRepo = getRepository(Skill);
      const skill = new Skill();
      skill.name = req.body.name;
      skill.homepage = req.body.homepage;
      skill.description = req.body.description;
      skillRepo.save(skill);
      res.json({ ok: true });
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
        name: Joi.string().min(3).lowercase().optional(),
        homepage: Joi.string().min(3).lowercase().optional(),
        description: Joi.string().optional()
      });
      const form = await skillScheme.validate(req.body);
      if (form.value.name) {
        skill.name = form.value.name;
      }
      if (form.value.homepage) {
        skill.homepage = form.value.homepage;
      }
      if (form.value.description) {
        skill.description = form.value.description;
      }
      skillRepo.save(skill);
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
      }
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
  }

}