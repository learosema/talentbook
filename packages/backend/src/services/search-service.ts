import { Request, Response } from 'express';
import { getRepository, Like } from 'typeorm';
import { UserSkill } from '../entities/user-skill';
import { getAuthUser } from '../auth-helper';
import { Identity } from '../entities/identity';
import { User } from '../entities/user';

type ResultListItem = {
  user?: User;
  skills: UserSkill[];
};

const groupByUser = (data: UserSkill[]) => {
  const result: Record<string, ResultListItem> = {};
  data.forEach(item => {
    if (!item.userName) {
      return;
    }
    if (!result[item.userName]) {
      result[item.userName] = { skills: [] };
    }
    result[item.userName].skills.push(item);
  });
  return result;
};

export class SearchService {
  static async query(req: Request, res: Response): Promise<void> {
    const identity: Identity | null = await getAuthUser(req);
    if (identity === null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const searchTerm: string = req.body?.searchTerm;
    if (!searchTerm || searchTerm.length === 0) {
      res.status(400).json({ error: 'Bad request' });
      return;
    }
    try {
      const where = searchTerm
        .split(' ')
        .filter(str => /^[a-zA-Z0-9#_\-./@+]+$/.test(str))
        .map(term => [
          { skillName: Like('%' + term + '%') },
          { userName: Like('%' + term + '%') }
        ])
        .flat();
      const userSkillRepo = getRepository(UserSkill);
      const userSkills = await userSkillRepo.find({ where });
      const resultList = groupByUser(userSkills);
      const userNames = Object.keys(resultList);
      const userRepo = getRepository(User);
      const users = await userRepo.find({
        select: ['name', 'fullName', 'location', 'pronouns', 'description'],
        where: userNames.map(name => ({ name }))
      });

      users.map(user => {
        if (!user.name || user.name in resultList === false) {
          return;
        }
        resultList[user.name].user = user;
      });
      res.status(200).json(Object.values(resultList));
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
