import { Request, Response } from 'express';
import { getRepository, Like, FindOperator } from 'typeorm';
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

const sillyUnquote = (str: string) =>
  /^".*"$/.test(str) ? str.slice(1, -1) : str;

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
    const searchTerms = (searchTerm.match(searchReg) || [])
      .map((term) => {
        const expr = term.split(':');
        if (expr.length === 1) {
          return [
            { skillName: Like('%' + sillyUnquote(expr[0]) + '%') },
            { userName: Like('%' + sillyUnquote(expr[0]) + '%') },
          ];
        }
        const exact = expr[0].startsWith('exact') && expr[0].length > 5;
        const criteria = exact
          ? expr[0][5].toLowerCase() + expr[0].slice(6)
          : expr[0];
        const likeExpr = Like(
          exact ? sillyUnquote(expr[1]) : '%' + sillyUnquote(expr[1]) + '%'
        );
        if (criteria === 'skill') {
          return [{ skillName: likeExpr }];
        }
        if (criteria === 'user') {
          return [{ userName: likeExpr }];
        }
        if (criteria === 'name') {
          userFilters.fullName = likeExpr;
        }
        if (criteria === 'location') {
          userFilters.location = likeExpr;
        }
        if (criteria === 'company') {
          userFilters.company = likeExpr;
        }
        if (criteria === 'github') {
          userFilters.githubUser = likeExpr;
        }
        if (criteria === 'twitter') {
          userFilters.twitterHandle = likeExpr;
        }
        return null;
      })
      .filter(Boolean)
      .flat();
    try {
      const where = searchTerms;
      const userSkillRepo = getRepository(UserSkill);
      const userSkills = await userSkillRepo.find({ where });
      const resultList = groupByUser(userSkills);
      const userNames = Object.keys(resultList);
      const userRepo = getRepository(User);
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
