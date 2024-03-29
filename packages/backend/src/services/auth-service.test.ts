import { hash, verify } from 'argon2';
import { mocked } from 'jest-mock';
import { Request, Response } from 'express';

import { Fakexpress } from '../test-utils/fakexpress';
import { getAuthUser, setAuthCookie, deleteAuthCookie } from '../auth-helper';
import { AuthService } from './auth-service';
import { createIdentity } from '../entities/identity';
import { AppDataSource } from '../data-source';
/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  getConnection: jest.fn(),
}));


/**
 * mock Data Source
 */
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  }
}));

/**
 * mock argon2 hashing algorithm
 */
jest.mock('argon2', () => ({
  hash: jest
    .fn()
    .mockImplementation(password => Promise.resolve('deadbeef' + password)),
  verify: jest
    .fn()
    .mockImplementation((hash, password) =>
      Promise.resolve(hash === 'deadbeef' + password ? true : false)
    )
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
  mocked(deleteAuthCookie).mockClear();
});

/**
 * AuthService.getLoginStatus tests
 */
describe('AuthService.getLoginStatus', () => {
  test('AuthService.getLoginStatus (not logged in)', async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    await AuthService.getLoginStatus(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(401);
    expect(xp.responseData).toStrictEqual({ error: 'Unauthorized' });
  });

  test('AuthService.getLoginStatus (logged in)', async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('max', 'Max Mister'))
    );
    await AuthService.getLoginStatus(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(xp.responseData).toStrictEqual({
      fullName: 'Max Mister',
      name: 'max',
      role: 'user'
    });
  });
});

describe('AuthService.login', () => {
  test('AuthService.login', async () => {
    const xp = new Fakexpress({
      body: {
        name: 'max',
        password: 'max123'
      }
    });
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    const passwordHash = await hash('max123');
    const isValid = await verify(passwordHash, 'max123');
    expect(isValid).toBe(true);
    mocked(AppDataSource.getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return {
          findOne: () =>
            Promise.resolve({
              name: 'max',
              fullName: 'Max Muster',
              passwordHash
            })
        };
      }
    });
    await AuthService.login(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(xp.responseData).toStrictEqual({
      message: 'ok',
      name: 'max',
      fullName: 'Max Muster'
    });
  });

  test('AuthService.login (already logged in)', async () => {
    const xp = new Fakexpress({
      body: {
        name: 'max',
        password: 'max123'
      }
    });
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('max', 'Max Muster'))
    );
    await AuthService.login(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(xp.responseData).toStrictEqual({
      message: 'Already logged in',
      identity: { name: 'max', fullName: 'Max Muster', role: 'user' }
    });
  });

  test('AuthService.login with invalid credentials', async () => {
    const xp = new Fakexpress({
      body: {
        name: 'max',
        password: 'wrongpw'
      }
    });
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    mocked(AppDataSource.getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return {
          findOne: () => Promise.resolve(null)
        };
      }
    });
    await AuthService.login(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(401);
    expect(xp.responseData).toStrictEqual({ error: 'Unauthorized' });
  });
});

describe('AuthService.signup', () => {
  test('AuthService.signup - happy path', async () => {
    const xp = new Fakexpress({
      body: {
        name: 'max',
        fullName: 'Max Muster',
        email: 'max@muster.de',
        password: 'blume123'
      }
    });
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    const fakeUserRepo = {
      count: jest.fn().mockImplementation(() => Promise.resolve(0)),
      insert: jest.fn().mockImplementation(() => Promise.resolve())
    };
    mocked(AppDataSource.getRepository).mockImplementation((func): any => {
      if (typeof func === 'function' && func.name === 'User') {
        return fakeUserRepo;
      }
    });
    await AuthService.signup(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(fakeUserRepo.count.mock.calls.length).toBe(1);
    expect(fakeUserRepo.insert.mock.calls.length).toBe(1);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
  });
});

describe('AuthService.logout', () => {
  test('AuthService.logout - happy path', async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(() =>
      Promise.resolve(createIdentity('max', 'Max Mister'))
    );
    await AuthService.logout(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(200);
    expect(mocked(deleteAuthCookie).mock.calls.length).toBe(1);
    expect(xp.responseData).toStrictEqual({ message: 'ok' });
  });

  test('AuthService.logout - not logged in', async () => {
    const xp = new Fakexpress({});
    mocked(getAuthUser).mockImplementation(() => Promise.resolve(null));
    await AuthService.logout(xp.req as Request, xp.res as Response);
    expect(xp.res.statusCode).toBe(401);
    expect(mocked(deleteAuthCookie).mock.calls.length).toBe(0);
    expect(xp.responseData).toStrictEqual({ error: 'Unauthorized' });
  });
});
