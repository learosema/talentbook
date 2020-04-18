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
  JS: {
    name: 'JavaScript',
    description: 'Everything about JS',
    homepage: 'https://javascript.example.org/',
    tags: 'js, javascript',
    type: TeamType.PUBLIC,
  },
};

const ExampleMembers = {
  Max: {
    userName: 'Max',
    teamName: 'JavaScript',
    userRole: TeamMemberRole.USER,
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

beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(getRepository).mockClear();
});

/**
 * TeamService.getTeams tests
 */
describe('Team Service tests', () => {
  test('TeamService.getTeams', async () => {
    const searchResult = [ExampleTeams.JS];
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
    const team = ExampleTeams.JS;
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
    const team = { ...ExampleTeams.JS, type: TeamType.SECRET };
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
      insert: jest
        .fn()
        .mockImplementation((team: any) => teamFakeDb.push(team)),
    };
    const teamMemberFakeRepo = {
      insert: jest
        .fn()
        .mockImplementation((member: any) => teamMemberFakeDb.push(member)),
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
      body: ExampleTeams.JS,
    });
    await TeamService.createTeam(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
    expect(xp.res.statusCode).toBe(200);
    expect(teamFakeDb.length).toBe(1);
    expect(teamMemberFakeDb.length).toBe(1);
  });
});
