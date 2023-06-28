import { Request, Response } from 'express';
import { Like } from 'typeorm';
import { Skill } from '../entities/skill';
import { getAuthUser } from '../auth-helper';
import Joi, { ValidationResult } from 'joi';
import { AppDataSource } from '../data-source';

export class SkillService {
  static async getSkills(_: Request, res: Response): Promise<void> {
    try {
      const skillRepo = AppDataSource.getRepository(Skill);
      const skills = await skillRepo.find();
      res.json(
        skills.map(({ name, category, homepage, description }) => ({
          name,
          category,
          homepage,
          description,
        }))
      );
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async addSkill(req: Request, res: Response): Promise<void> {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let form: ValidationResult | null = null;
    if (req.body) {
      try {
        const skillScheme = Joi.object({
          name: Joi.string().trim().required(),
          category: Joi.string().trim().allow('', null).optional(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional(),
        });
        form = skillScheme.validate(req.body);
        if (!form || form.error) {
          res.status(400).json({ error: 'Bad request', details: form?.error });
          return;
        }
      } catch (ex: any) {
        res.status(500).json({ error: `${ex.name}: ${ex.message}` });
        return;
      }
    }
    if (!form || form.error) {
      res.status(400).json({ error: 'Bad request' });
      return;
    }
    try {
      const skillRepo = AppDataSource.getRepository(Skill);
      const skill = new Skill();
      skill.name = form.value.name;
      skill.category = form.value.category;
      skill.homepage = form.value.homepage;
      skill.description = form.value.description;
      const count = await skillRepo.count({where: { name: skill.name }});
      if (count > 0) {
        res.status(403).json({ error: 'Skill already exists' });
        return;
      }
      await skillRepo.insert(skill);
      res.json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async updateSkill(req: Request, res: Response): Promise<void> {
    const skillName = req.params.name;
    const identity = await getAuthUser(req);
    if (!identity) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const skillRepo = AppDataSource.getRepository(Skill);
      const skill = await skillRepo.findOne({where: { name: Like(skillName) }});
      if (!skill) {
        res.status(404).json({ error: 'Skill not found' });
        return;
      }
      const skillScheme = Joi.object({
        homepage: Joi.string()
          .trim()
          .min(3)
          .lowercase()
          .uri()
          .allow('', null)
          .optional(),
        category: Joi.string().trim().allow('', null).optional(),
        description: Joi.string().trim().allow('', null).optional(),
      });
      let form: ValidationResult | null = null;
      if (req.body) {
        form = skillScheme.validate(req.body);
      }
      if (!form || form.error) {
        res.status(400).json({ error: 'Bad request', details: form?.error });
        return;
      }
      if (form.value.homepage) {
        skill.homepage = form.value.homepage;
      }
      if (form.value.description) {
        skill.description = form.value.description;
      }
      if (form.value.category) {
        skill.category = form.value.category;
      }
      await skillRepo.save(skill);
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async deleteSkill(req: Request, res: Response): Promise<void> {
    const skillName = req.params.name;
    const identity = await getAuthUser(req);
    if (!identity) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const skillRepo = AppDataSource.getRepository(Skill);
      const deleteResult = await skillRepo.delete({ name: skillName });
      if (deleteResult.affected === 0) {
        res.status(404).json({ error: 'Skill not found' });
        return;
      }
      res.status(200).json({ message: 'ok' });
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
