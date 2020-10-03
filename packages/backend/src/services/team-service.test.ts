import { mocked } from 'ts-jest/utils';
import { Fakexpress } from '../test-utils/fakexpress';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { getAuthUser } from '../auth-helper';
import { TeamType } from '../entities/team';
import { TeamService } from './team-service';
import { createIdentity } from '../entities/identity';
import { TeamMemberRole } from '../entities/team-member';

const ExampleTeams = {
  JS: () => ({
    name: 'JavaScript',
    description: 'Everything about JS',
    homepage: 'https://javascript.example.org/',
    tags: 'js, javascript',
    type: TeamType.PUBLIC,
  }),
  JSSecret: () => ({
    ...ExampleTeams.JS(),
    type: TeamType.SECRET,
  }),
};

const ExampleMembers = {
  Max: {
    userName: 'Max',
    teamName: 'JavaScript',
    userRole: TeamMemberRole.USER,
  },
  MaxAdmin: {
    userName: 'Max',
    teamName: 'JavaScript',
    userRole: TeamMemberRole.ADMIN,
  },
  MaxInvited: {
    userName: 'Max',
    teamName: 'JavaScript',
    userRole: TeamMemberRole.INVITED,
  },
  BannedLea: {
    userName: 'Lea',
    teamName: 'JavaScript',
    userRole: TeamMemberRole.BANNED,
  },
};

/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryColumn: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  Like: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn(),
  Any: jest.fn(),
}));

/**
 * mock auth cookie stuff
 */
jest.mock('../auth-helper', () => ({
  getAuthUser: jest.fn(),
}));

jest.mock('../notify', () => ({
  notify: jest.fn().mockImplementation(() => Promise.resolve()),
}));

beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(getRepository).mockClear();
});

/**
 * TeamService.getTeams tests
 */
describe('Team Service tests', () => {
  test('TeamService.getTeams', async () => {
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const searchResult = [ExampleTeams.JS()];
    const xp = new Fakexpress({});
    mocked(getRepository).mockImplementation((): any => {
      return {
        find: () => Promise.resolve(searchResult),
      };
    });
    await TeamService.getTeams(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(xp.responseData).toStrictEqual(searchResult);
  });
});

/**
 * TeamService.getTeams tests
 */
describe('TeamService.getTeam tests', () => {
  test('TeamService.getTeam - happy path', async () => {
    const team = ExampleTeams.JS();
    const members = Object.values(ExampleMembers);
    const teamFakeRepo = {
      findOne: jest.fn().mockImplementation(() => Promise.resolve(team)),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      find: jest.fn().mockImplementation(() => Promise.resolve(members)),
    };
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        name: 'JavaScript',
      },
    });
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.getTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({
      team,
      members,
    });
    expect(xp.res.statusCode).toBe(200);
  });

  test('TeamService.getTeam - not logged in', async () => {
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    const xp = new Fakexpress({
      params: {
        name: 'JavaScript',
      },
    });
    await TeamService.getTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: 'Unauthorized' });
    expect(xp.res.statusCode).toBe(401);
  });

  test('TeamService.getTeam - secret group and user not in group', async () => {
    const team = { ...ExampleTeams.JSSecret() };
    const members = Object.values(ExampleMembers);
    const teamFakeRepo = {
      findOne: jest.fn().mockImplementation(() => Promise.resolve(team)),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(0)),
      find: jest.fn().mockImplementation(() => Promise.resolve(members)),
    };
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Lea', 'Lea Muserfrau'))
    );
    const xp = new Fakexpress({
      params: {
        name: 'JavaScript',
      },
    });
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.getTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: 'Not found' });
    expect(xp.res.statusCode).toBe(404);
  });
});

/**
 * TeamService.createTeam tests
 */
describe('TeamService.createTeam tests', () => {
  test('TeamService.createTeam - happy path', async () => {
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const teamFakeDb: any[] = [];
    const teamMemberFakeDb: any[] = [];
    const teamFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(0)),
      insert: jest.fn().mockImplementation((team: any) => {
        teamFakeDb.push(team);
        return Promise.resolve();
      }),
    };
    const teamMemberFakeRepo = {
      insert: jest.fn().mockImplementation((member: any) => {
        teamMemberFakeDb.push(member);
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    const xp = new Fakexpress({
      body: ExampleTeams.JS(),
    });
    await TeamService.createTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(teamFakeDb.length).toBe(1);
    expect(teamMemberFakeDb.length).toBe(1);
  });
});

/**
 * Update Member tests
 */
describe('TeamService.updateTeam tests', () => {
  test('TeamService.updateTeam - happy path', async () => {
    const teamName = 'JavaScript';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        name: teamName,
      },
      body: {
        name: 'JavaScript',
        description: 'the best parts',
        homepage: 'https://developer.mozilla.org/',
        tags: 'programming',
        type: TeamType.CLOSED,
      },
    });
    let saved = false;
    const teamFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleTeams.JS())),
      save: jest.fn().mockImplementation(() => {
        saved = true;
        return Promise.resolve();
      }),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.updateTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(saved).toBe(true);
  });

  test('TeamService.updateTeam - no privileges', async () => {
    const teamName = 'JavaScript';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Lea', 'Lea Muster'))
    );
    const xp = new Fakexpress({
      params: {
        name: teamName,
      },
      body: {
        name: 'JavaScript',
        description: 'the best parts',
        homepage: 'https://developer.mozilla.org/',
        tags: 'programming',
        type: TeamType.CLOSED,
      },
    });
    let saved = false;
    const teamFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleTeams.JS())),
      save: jest.fn().mockImplementation(() => {
        saved = true;
        return Promise.resolve();
      }),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(0)),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.updateTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ error: 'Permission denied' });
    expect(xp.res.statusCode).toBe(403);
    expect(saved).toBe(false);
  });
});

/**
 *
 */
describe('TeamService.deleteTeam tests', () => {
  test('TeamService.deleteTeam - happy path', async () => {
    const teamName = 'JavaScript';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        name: teamName,
      },
    });
    let deleted = false;
    let membersDeleted = false;
    const teamFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      delete: jest.fn().mockImplementation(() => {
        deleted = true;
        return Promise.resolve();
      }),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      delete: jest.fn().mockImplementation(() => {
        membersDeleted = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.deleteTeam(xp.req as Request, xp.res as Response);
    expect(deleted).toBe(true);
    expect(membersDeleted).toBe(true);
  });
});

/**
 * TeamService.updateMember tests
 */
describe('TeamService.updateMember tests', () => {
  test('TeamService.updateMember - happy path', async () => {
    const teamName = 'JavaScript';
    const userName = 'Lea';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        teamName,
        userName,
      },
      body: {
        userRole: TeamMemberRole.ADMIN,
      },
    });
    let updated = false;
    const teamFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleMembers.MaxAdmin)),
      save: jest.fn().mockImplementation(() => {
        updated = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.updateMember(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(updated).toBe(true);
  });
});

describe('TeamService.deleteMember tests', () => {
  test('TeamService.deleteMember - happy path', async () => {
    const teamName = 'JavaScript';
    const userName = 'Lea';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        teamName,
        userName,
      },
      body: {
        role: TeamMemberRole.ADMIN,
      },
    });
    let deleted = false;
    const teamFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleMembers.MaxAdmin)),
      delete: jest.fn().mockImplementation(() => {
        deleted = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.deleteMember(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(deleted).toBe(true);
  });
});

describe('TeamService.inviteUser tests', () => {
  test('TeamService.inviteUser tests - happy path', async () => {
    const teamName = 'JavaScript';
    const userName = 'Lea';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        teamName,
        userName,
      },
    });
    let invited = false;
    const teamFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleTeams.JS())),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(1)),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
      save: jest.fn().mockImplementation(() => {
        invited = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.inviteUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(invited).toBe(true);
  });
});

describe('TeamService.acceptInvite tests', () => {
  test('TeamService.acceptInvite tests - happy path', async () => {
    const teamName = 'JavaScript';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        teamName,
      },
    });
    let accepted = false;
    const teamFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleTeams.JS())),
    };
    const teamMemberFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleMembers.MaxInvited)),
      save: jest.fn().mockImplementation(() => {
        accepted = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.acceptInvite(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(accepted).toBe(true);
  });
});

describe('TeamService.joinTeam tests', () => {
  test('TeamService.joinTeam tests - happy path', async () => {
    const teamName = 'JavaScript';
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('Max', 'Max Muster'))
    );
    const xp = new Fakexpress({
      params: {
        teamName,
      },
    });
    let joined = false;
    const teamFakeRepo = {
      findOne: jest
        .fn()
        .mockImplementation(() => Promise.resolve(ExampleTeams.JS())),
    };
    const teamMemberFakeRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(0)),
      insert: jest.fn().mockImplementation(() => {
        joined = true;
        return Promise.resolve();
      }),
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'Team') {
        return teamFakeRepo;
      }
      if (typeof func === 'function' && func.name === 'TeamMember') {
        return teamMemberFakeRepo;
      }
      throw Error('Not supported');
    });
    await TeamService.joinTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(joined).toBe(true);
  });
});
