import { mocked } from 'ts-jest/utils';
import { Fakexpress } from '../test-utils/fakexpress';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { getAuthUser, setAuthCookie } from '../auth-helper';
import { createIdentity } from '../entities/identity';
import { UserService } from './user-service';

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
  getRepository: jest.fn()
}));

/** 
 * mock auth cookie stuff
 */
jest.mock('../auth-helper', () => ({
  getAuthUser: jest.fn(),
  setAuthCookie: jest.fn().mockImplementation(() => Promise.resolve())
}));

beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(setAuthCookie).mockClear();
  mocked(getRepository).mockClear();
});

describe('UserService.getUser', () => {

  test('UserService.getUser - happy path', async () => {
    const xp = new Fakexpress({
      params: {
        name: 'max'
      }
    });
    mocked(getAuthUser).mockImplementation((req) => Promise.resolve(createIdentity('max', 'Max Muster')));
    const searchResult = {
      name: 'max',
      fullName: 'Max Muster',
      description: 'Full Stack TypeScript developer',
      twitterHandle: 'max_muster',
      githubUser: 'max_muster',
      location: 'Berlin'
    };
    const fakeRepo = {
      findOneOrFail: jest.fn().mockImplementation(() => Promise.resolve(searchResult))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return fakeRepo;
      }
      throw Error('Not supported');
    });
    await UserService.getUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual(searchResult);
    expect(xp.res.statusCode).toBe(200);
  });


  test('UserService.getUser - not logged in', async () => {
    const xp = new Fakexpress({
      params: {
        name: 'max'
      }
    });
    mocked(getAuthUser).mockImplementation((req) => Promise.resolve(null));
    await UserService.getUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({error: 'Unauthorized'});
    expect(xp.res.statusCode).toBe(401);
  });

});