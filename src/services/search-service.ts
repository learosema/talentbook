import { Request, Response } from 'express';
import { getRepository, Like } from 'typeorm';
import { UserSkill } from '../entities/user-skill';
import { getAuthUser } from '../auth-helper';
import { Identity } from '../entities/identity';

export class SearchService {

  static async query(req: Request, res: Response): Promise<void> {
    const identity : Identity|null = await getAuthUser(req);
    if (identity === null) {
      res.status(401).json({error: 'Unauthorized'});
      return;
    }
    const searchTerm = req.body.searchTerm;
    if (!searchTerm || searchTerm.length === 0) {
      res.status(400).json({error: 'Bad request'});
      return;
    }
    try {
      const userSkillRepo = getRepository(UserSkill);
      const userSkills = await userSkillRepo.find({
        where: [
          {skillName: Like(searchTerm)}
        ]
      });
      res.status(200).json(userSkills);
    } catch (ex) {
      res.status(500).json({error: `${ex.name}: ${ex.message}`});
    }
    res.json({searchTerm});
  }
}