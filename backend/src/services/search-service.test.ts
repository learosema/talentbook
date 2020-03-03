import { mocked } from 'ts-jest/utils';
import { Fakexpress } from '../test-utils/fakexpress';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { getAuthUser } from '../auth-helper';
import { SearchService } from './search-service';
import { createIdentity } from '../entities/identity';

/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  Like: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn()
}));

/**
 * mock auth cookie stuff
 */
jest.mock('../auth-helper', () => ({
  getAuthUser: jest.fn()
}));

beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(getRepository).mockClear();
});

/**
 * Search Service tests
 */
describe('SearchService.query', () => {
  /**
   * Happy path
   */
  test('SearchService.query - happy path', async () => {
    const xp = new Fakexpress({
      body: {
        searchTerm: 'react'
      }
    });
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('max', 'Max Muster'))
    );
    const user = {
      name: 'max',
      fullName: 'Max Muster',
      description: 'Awesome coder',
      pronouns: 'he/they'
    };
    const skills = [
      { userName: 'max', skillName: 'react', skillLevel: 4, willLevel: 5 }
    ];
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return {
          find: () => Promise.resolve([user])
        };
      }
      if (typeof func === 'function' && func.name === 'UserSkill') {
        return {
          find: () => Promise.resolve(skills)
        };
      }
    });
    await SearchService.query(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    const expectedResult = [
      {
        user,
        skills
      }
    ];
    console.error(xp.responseData);
    expect(xp.responseData).toStrictEqual(expectedResult);
  });

  /**
   * User is not logged in
   */
  test('SearchService.query - not logged in', async () => {
    const xp = new Fakexpress({
      body: {
        searchTerm: 'react'
      }
    });
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    await SearchService.query(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(401);
    expect(xp.responseData).toStrictEqual({ error: 'Unauthorized' });
  });

  /**
   * User submits invalid request
   */
  test('SearchService.query - bad request', async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('max', 'Max Muster'))
    );
    await SearchService.query(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(400);
    expect(xp.responseData).toStrictEqual({ error: 'Bad request' });
  });
});
