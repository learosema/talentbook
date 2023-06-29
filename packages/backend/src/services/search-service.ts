import { Request, Response } from 'express';
import { FindOperator, ILike } from 'typeorm';
import { UserSkill } from '../entities/user-skill';
import { getAuthUser } from '../auth-helper';
import { Identity } from '../entities/identity';
import { User } from '../entities/user';
import { AppDataSource } from '../data-source';

type ResultListItem = {
  user?: User;
  skills: UserSkill[];
};

const groupByUser = (data: UserSkill[]) => {
  const result: Record<string, ResultListItem> = {};
  data.forEach((item) => {
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

const unquote = (str: string) =>
  /^".*"$/.test(str) ? str.slice(1, -1).replace(/([^\w ])/g, '\\$1') : str;

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

    const searchReg =
      /((\w+:)?("[a-zA-Z0-9#_\-+.\\/@ ]+"|[a-zA-Z0-9#_\-+.\\/@]+))/g;
    const userFilters: Record<string, FindOperator<string>> = {};
    const where: Array<Record<string, FindOperator<string>>> = []; 
    for (const term of (searchTerm.match(searchReg) || [])) {
      const withCriteria = term.match(/^(\w+):["'](\w+)["']$/);
      if (! withCriteria) {
        where.push(
          { skillName: ILike('%' + unquote(term) + '%',) },
          { userName: ILike('%' + unquote(term) + '%') }
        );
        continue;
      }
      where.push({[withCriteria[0]]: ILike('%' + withCriteria[1] + '%')});
    }
    try {
      const userSkillRepo = AppDataSource.getRepository(UserSkill);
      const userSkills = await userSkillRepo.find({where});
      const resultList = groupByUser(userSkills);
      const userNames = Object.keys(resultList);
      const userRepo = AppDataSource.getRepository(User);
      const usersWhere = userNames.map((name) => ({ ...userFilters, name }));
      const users = await userRepo.find({
        select: [
          'name',
          'fullName',
          'company',
          'location',
          'homepage',
          'pronouns',
          'description',
        ],
        where: usersWhere,
      });
      users.map((user) => {
        if (!user.name || user.name in resultList === false) {
          return;
        }
        resultList[user.name].user = user;
      });
      res
        .status(200)
        .json(Object.values(resultList).filter((item) => Boolean(item.user)));
    } catch (ex: any) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
