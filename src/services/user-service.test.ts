import { mocked } from 'ts-jest/utils';
import { Fakexpress } from '../test-utils/fakexpress';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { getAuthUser, setAuthCookie, deleteAuthCookie } from '../auth-helper';
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
  setAuthCookie: jest.fn().mockImplementation(() => Promise.resolve()),
  deleteAuthCookie: jest.fn()
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

  test('UserService.getUser - user not found', async () => {
    const xp = new Fakexpress({
      params: {
        name: 'emma'
      }
    });
    mocked(getAuthUser).mockImplementation((req) => Promise.resolve(createIdentity('max', 'Max Muster')));
    const fakeRepo = {
      findOneOrFail: jest.fn().mockImplementation(() => Promise.reject({name: 'EntityNotFound'}))
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return fakeRepo;
      }
      throw Error('Not supported');
    });
    await UserService.getUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({error: 'Not found'});
    expect(xp.res.statusCode).toBe(404);
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

describe('UserService.updateUser', () => {

  test('UserService.updateUser - happy path', async () => {
    const xp = new Fakexpress({
      params: {
        name: 'max'
      },
      body: {
        name: 'maxmuster',
        fullName: 'Max Mustermann',
        location: 'Hamburg',
        description: 'Awesome pattern coder',
        twitterHandle: 'madmaxmuster',
        githubUser: 'madmaxmuster',
        email: 'max@mustermax.de'
      }
    });
    mocked(getAuthUser).mockImplementation((req) => Promise.resolve(createIdentity('max', 'Max Muster')));
    const searchResult = {
      name: 'max',
      fullName: 'Max Muster',
      location: 'Berlin',
      description: '',
      twitterHandle: '',
      githubUser: '',
      email: 'max@muster.de'
    };
    const fakeRepo = {
      findOne: jest.fn().mockImplementation(() => Promise.resolve(searchResult)),
      save: jest.fn().mockImplementation(() => Promise.resolve())
    };
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return fakeRepo;
      }
      throw Error('Not supported');
    });
    await UserService.updateUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({message: 'ok'});
    expect(xp.res.statusCode).toBe(200);
    expect(fakeRepo.findOne.mock.calls.length).toBe(1);
    expect(fakeRepo.save.mock.calls.length).toBe(1);
    expect(mocked(setAuthCookie).mock.calls.length).toBe(1);
  });

});

describe('UserService.deleteUser', () => {
  test('UserService.deleteUser - happy path', async () => {
    const xp = new Fakexpress({
      params: {
        name: 'max'
      }
    });
    mocked(getAuthUser).mockImplementation((req) => Promise.resolve(createIdentity('max', 'Max Muster')));
    const fakeRepo = (affected: number) => ({
      delete: jest.fn().mockImplementation(() => Promise.resolve({affected})),
    });
    mocked(getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && (func.name === 'User' || func.name === 'UserSkill')) {
        return fakeRepo(1);
      }
      throw Error('Not supported');
    });
    await UserService.deleteUser(xp.req as Request, xp.res as Response);
    expect(xp.responseData).toStrictEqual({message: 'ok'});
    expect(xp.res.statusCode).toBe(200);
  });

});