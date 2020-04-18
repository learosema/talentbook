import { Request, Response } from 'express';
import { getRepository, Any } from 'typeorm';
import { Team, TeamType } from '../entities/team';
import { TeamMember, TeamMemberRole } from '../entities/team-member';
import { getAuthUser } from '../auth-helper';
import Joi, { ValidationResult } from '@hapi/joi';
import { notify, MessageTemplates } from '../notify';

export class TeamService {
  static async getTeams(_: Request, res: Response) {
    try {
      const teamRepo = getRepository(Team);
      const teams = await teamRepo.find({
        where: [{ type: TeamType.PUBLIC }, { type: TeamType.CLOSED }],
      });
      res.status(200).json(teams);
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async getTeam(req: Request, res: Response) {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const name = req.params.name;
      const teamRepo = getRepository(Team);
      const teamMemberRepo = getRepository(TeamMember);
      const team = await teamRepo.findOne({ name });
      if (!team) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (team.type === TeamType.SECRET) {
        // If the team is a secret one, return 404 if user is not in group
        const memberCount = await teamMemberRepo.count({
          where: {
            teamName: name,
            userName: user.name,
            userRole: Any([
              TeamMemberRole.ADMIN,
              TeamMemberRole.INVITED,
              TeamMemberRole.USER,
            ]),
          },
        });
        if (memberCount === 0) {
          res.status(404).json({ error: 'Not found' });
          return;
        }
      }
      const members = await teamMemberRepo.find({
        teamName: name,
      });
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
    let form: ValidationResult | null = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          name: Joi.string().trim().required(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional(),
          tags: Joi.string().trim().allow('', null).optional(),
          type: Joi.string()
            .trim()
            .required()
            .valid(TeamType.PUBLIC, TeamType.CLOSED, TeamType.SECRET),
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
      team.type = form.value.type;
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
    let form: ValidationResult | null = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          name: Joi.string().trim().required(),
          description: Joi.string().trim().allow('', null).optional(),
          homepage: Joi.string().trim().uri().allow('', null).optional(),
          tags: Joi.string().trim().allow('', null).optional(),
          type: Joi.string()
            .trim()
            .required()
            .valid([TeamType.PUBLIC, TeamType.CLOSED, TeamType.SECRET]),
        });
        form = teamScheme.validate(req.body);
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
      team.type = form.value.type;
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

  /**
   *
   * @param req
   * @param res
   */
  static async updateMember(req: Request, res: Response) {
    const teamName = req.params.teamName;
    const userName = req.params.userName;
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let form: ValidationResult | null = null;
    if (req.body) {
      try {
        const teamScheme = Joi.object({
          role: Joi.string()
            .trim()
            .valid([
              TeamMemberRole.ADMIN,
              TeamMemberRole.USER,
              TeamMemberRole.BANNED,
            ]),
        });
        form = teamScheme.validate(req.body);
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
      const teamMemberRepo = getRepository(TeamMember);
      const count = await teamRepo.count({ name: teamName });
      if (count === 0) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      // check if user is group admin
      const isGroupAdmin = await teamMemberRepo.count({
        teamName,
        userName: user.name,
        userRole: 'admin',
      });
      if (user.role !== 'admin' && isGroupAdmin === 0) {
        res.status(403).json({ error: 'Permission denied' });
        return;
      }
      const member = await teamMemberRepo.findOne({ teamName, userName });
      if (!member) {
        res.status(403).json({ error: 'User is not a member of this group' });
        return;
      }
      if (
        isGroupAdmin > 0 &&
        user.name === userName &&
        form?.value.role !== TeamMemberRole.ADMIN
      ) {
        // if the user removes admin status from themself,
        // check if there is at least one other admin in the group.
        const countMembers = await teamMemberRepo.count({
          teamName,
          userRole: 'admin',
        });
        if (countMembers <= 1) {
          res.status(403).json({
            error:
              'You are the last admin of this group. Promote someone before you continue.',
          });
          return;
        }
      }
      member.userRole = form?.value.role;
      await teamMemberRepo.save(member);
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  static async deleteMember(req: Request, res: Response) {
    const teamName = req.params.teamName;
    const userName = req.params.userName;
    const user = await getAuthUser(req);
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
      // check if user is group admin
      const isGroupAdmin = await teamMemberRepo.count({
        teamName,
        userName: user.name,
        userRole: 'admin',
      });
      if (
        userName !== user.name &&
        user.role !== 'admin' &&
        isGroupAdmin === 0
      ) {
        res.status(403).json({ error: 'Permission denied' });
        return;
      }
      const member = await teamMemberRepo.findOne({ teamName, userName });
      if (!member) {
        res.status(403).json({ error: 'User is not a member of this group' });
        return;
      }
      if (isGroupAdmin > 0 && user.name === userName) {
        // if the user is a group admin who removes themselves from the group,
        // check, if there is at least one other admin in the group.
        const countMembers = await teamMemberRepo.count({
          teamName,
          userRole: TeamMemberRole.ADMIN,
        });
        if (countMembers <= 1) {
          res.status(403).json({
            error:
              'You are the last admin of this group. Promote someone before leave.',
          });
          return;
        }
      }
      await teamMemberRepo.delete({ teamName, userName });
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  /**
   * Send invitation to join a team
   */
  static async inviteUser(req: Request, res: Response) {
    const teamName = req.params.teamName;
    const userName = req.params.userName;
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (user.name === userName) {
      res.status(403).json({ error: 'You cannot invite yourself.' });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const group = await teamRepo.findOne({ name: teamName });
      if (!group) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const teamMemberRepo = getRepository(TeamMember);
      const userInGroup = await teamMemberRepo.findOne({ teamName, userName });
      if (userInGroup) {
        if (userInGroup.userRole === TeamMemberRole.REQUESTED) {
          // if you invite a user who already requested membership,
          // directly add the user to the team
          userInGroup.userRole = TeamMemberRole.USER;
          await teamMemberRepo.save(userInGroup);
          notify(
            user.name,
            userName,
            MessageTemplates.inviteAccepted(user.name, teamName)
          );
          res.status(200).json({ message: 'ok' });
        }
        res
          .status(403)
          .json({ error: 'User is already a member of this group' });
        return;
      }
      // check if user is group admin
      const isGroupAdmin = await teamMemberRepo.count({
        teamName,
        userName: user.name,
        userRole: 'admin',
      });
      if (user.role !== 'admin' && isGroupAdmin === 0) {
        res.status(403).json({ error: 'Permission denied' });
        return;
      }
      const invitation = new TeamMember();
      invitation.teamName = teamName;
      invitation.userName = userName;
      invitation.userRole = TeamMemberRole.INVITED;
      await teamMemberRepo.save(invitation);
      // TODO: notification :)
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  /**
   * Accept invitation to join a team
   */
  static async acceptInvite(req: Request, res: Response) {
    const teamName = req.params.teamName;
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const group = await teamRepo.findOne({ name: teamName });
      if (!group) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const teamMemberRepo = getRepository(TeamMember);
      const member = await teamMemberRepo.findOne({
        userName: user.name,
        teamName,
        userRole: TeamMemberRole.INVITED,
      });
      if (!member) {
        res.status(403).json({ error: 'No invitation.' });
        return;
      }
      member.userRole = 'user';
      await teamMemberRepo.save(member);
      res.status(200).json({ message: 'ok' });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }

  /**
   * Join Team or request membership
   */
  static async joinTeam(req: Request, res: Response) {
    const user = await getAuthUser(req);
    const teamName = req.params.name;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const teamRepo = getRepository(Team);
      const team = await teamRepo.findOne({ name: teamName });
      if (!team) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      if (team.type === TeamType.SECRET) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const teamMemberRepo = getRepository(TeamMember);
      const memberCount = await teamMemberRepo.count({
        teamName,
        userName: user.name,
      });
      if (memberCount !== 0) {
        res.status(403).json({ error: 'User is already member of this group' });
        return;
      }
      const member = new TeamMember();
      member.teamName = teamName;
      member.userName = user.name;
      member.userRole =
        team.type === 'PUBLIC' ? TeamMemberRole.USER : TeamMemberRole.REQUESTED;
      await teamMemberRepo.insert(member);
      res
        .status(200)
        .json({
          message: team.type === 'PUBLIC' ? 'ok' : 'membership requested',
        });
    } catch (ex) {
      res.status(500).json({ error: `${ex.name}: ${ex.message}` });
    }
  }
}
