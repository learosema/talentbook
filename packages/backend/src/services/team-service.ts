import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Team } from '../entities/team';
import { TeamMember } from '../entities/team-member';
import { getAuthUser } from '../auth-helper';
import Joi from '@hapi/joi';

export class TeamService {
  static async getTeams(req: Request, res: Response) {
    try {
      const teamRepo = getRepository(Team);
      const teams = await teamRepo.find();
      res.status(200).json(teams);
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async getTeam(req: Request, res: Response) {
    try {
      const name = req.params.name;
      const teamRepo = getRepository(Team);
      const teamMemberRepo = getRepository(TeamMember);
      const team = await teamRepo.find({ name });
      const members = await teamMemberRepo.find({ teamName: name });
      res.status(200).json({
        team,
        members,
      });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async createTeam(req: Request, res: Response) {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let form = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          name: Joi.string().trim().required(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional(),
          tags: Joi.string().trim().allow('', null).optional(),
          public: Joi.bool().required(),
        });
        form = await teamScheme.validate(req.body);
        if (!form || form.error) {
          res.status(400).json({ error: 'Bad request', details: form?.error });
          return;
        }
      } catch (ex) {
        res.status(500).json({ error: `${ex.name}: ${ex.message}` });
        return;
      }
    }
    if (!form || form.error) {
      res.status(400).json({ error: 'Bad request', details: form?.error });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const team = new Team();
      team.name = form.value.name;
      team.description = form.value.description;
      team.homepage = form.value.homepage;
      team.tags = form.value.tags;
      team.public = form.value.public;
      const count = await teamRepo.count({ name: team.name });
      if (count > 0) {
        res.status(403).json({ error: 'Team already exists' });
        return;
      }
      await teamRepo.insert(team);
      const teamMemberRepo = getRepository(TeamMember);
      const member = new TeamMember();
      member.teamName = team.name;
      member.userName = user.name;
      member.userRole = 'admin';
      await teamMemberRepo.insert(member);
      res.json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async updateTeam(req: Request, res: Response) {
    const user = await getAuthUser(req);
    const teamName = req.params.name;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let form = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          name: Joi.string().trim().required(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional(),
          tags: Joi.string().trim().allow('', null).optional(),
          public: Joi.bool().required(),
        });
        form = await teamScheme.validate(req.body);
        if (!form || form.error) {
          res.status(400).json({ error: 'Bad request', details: form?.error });
          return;
        }
      } catch (ex) {
        res.status(500).json({ error: `${ex.name}: ${ex.message}` });
        return;
      }
    }
    if (!form || form.error) {
      res.status(400).json({ error: 'Bad request', details: form?.error });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const teamMemberRepo = getRepository(TeamMember);
      const count = await teamMemberRepo.count({
        teamName,
        userName: user.name,
        userRole: 'admin',
      });
      if (user.role !== 'admin' && count === 0) {
        res.status(403).json({ error: 'Permission denied' });
        return;
      }
      const team = await teamRepo.findOne({ name: teamName });
      if (!team) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      team.name = form.value.name;
      team.homepage = form.value.homepage;
      team.description = form.value.description;
      team.tags = form.value.tags;
      team.public = form.value.public;
      await teamRepo.save(team);
      res.json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    const user = await getAuthUser(req);
    const teamName = req.params.name;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const teamMemberRepo = getRepository(TeamMember);
      const count = await teamRepo.count({ name: teamName });
      if (count === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      await teamRepo.delete({ name: teamName });
      await teamMemberRepo.delete({ teamName });
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async getMembers(req: Request, res: Response) {
    const user = await getAuthUser(req);
    const teamName = req.params.name;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const teamMemberRepo = getRepository(TeamMember);
      const count = await teamRepo.count({ name: teamName });
      if (count === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const members = await teamMemberRepo.find({ teamName });
      res.status(200).json(members);
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async addMember(req: Request, res: Response) {
    const user = await getAuthUser(req);
    const teamName = req.params.name;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let form = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          name: Joi.string().trim().required(),
          role: Joi.string().trim().required(),
        });
        form = await teamScheme.validate(req.body);
        if (!form || form.error) {
          res.status(400).json({ error: 'Bad request', details: form?.error });
          return;
        }
      } catch (ex) {
        res.status(500).json({ error: `${ex.name}: ${ex.message}` });
        return;
      }
    }
    try {
      const teamRepo = getRepository(Team);
      const count = await teamRepo.count({ name: teamName });
      if (count === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const teamMemberRepo = getRepository(TeamMember);
      const isGroupAdmin = await teamMemberRepo.count({
        teamName,
        userName: user.name,
        userRole: 'admin',
      });
      if (user.role !== 'admin' && isGroupAdmin === 0) {
        res.status(403).json({ error: 'Permission denied' });
        return;
      }
      const memberCount = await teamMemberRepo.count({
        teamName,
        userName: form?.value.name,
      });
      if (memberCount !== 0) {
        res.status(403).json({ error: 'User is already member of this group' });
      }
      const member = new TeamMember();
      member.teamName = teamName;
      member.userName = form?.value.name;
      member.userRole = form?.value.role;
      await teamMemberRepo.insert(member);
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
