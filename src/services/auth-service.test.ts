import { mocked } from 'ts-jest/utils';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { getAuthUser, setAuthCookie, deleteAuthCookie } from '../auth-helper';
import { AuthService } from './auth-service';
import { createIdentity } from '../entities/identity';

/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn()
}));

/** 
 * mock auth cookie stuff
 */
jest.mock('../auth-helper', () => ({
  getAuthUser: jest.fn(),
  setAuthCookie: jest.fn(),
  deleteAuthCookie: jest.fn()
}))


beforeEach(() => {
  mocked(getAuthUser).mockClear();
  mocked(setAuthCookie).mockClear();
  mocked(deleteAuthCookie).mockClear();
  mocked(getRepository).mockClear();
})

/**
 * AuthService tests
 */
describe('AuthService tests', () => {

  test('AuthService.getLoginStatus', async () => {
    let statusCode = 200;
    let data : object|null = null;
    const req = {}
    const res : Partial<Response> = {
      status: jest.fn().mockImplementation((code) => {
        statusCode = code;
        return res;
      }),
      json: jest.fn().mockImplementation((jsObject) => {
        data = jsObject;
        return res;
      })
    };
    mocked(getAuthUser).mockImplementation((req) => {
      return new Promise((resolve, reject) => {
        resolve(createIdentity('max', 'Max Mister'));
      })
    });
    await AuthService.getLoginStatus(req as Request, res as Response);
    expect(statusCode).toBe(200);
    expect(data).toStrictEqual({
       fullName: 'Max Mister', name: 'max'
    });
  });

});