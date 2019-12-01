import { jwtSign, jwtVerify } from './security-helpers';
import { User } from './entities/user';
import express from 'express';

const COOKIE_NAME = 'talentbook_authtoken';

// TODO: provide some nice JWT signoptions and some more cookie options.

export async function getUser(req: express.Request): Promise<User|null> {
  if (req.cookies) {
    try {
      const user: User = <User>await jwtVerify(req.cookies[COOKIE_NAME]);
    } catch (ex) {
      return null;
    }
  }
  return null;
}

export async function setAuthCookie(res: express.Response, userName: string, fullName: string): Promise<void> {
  try {
    const user = new User();
    user.name = userName;
    user.fullName = fullName;
    const token : string = await jwtSign(user);
    res.cookie(COOKIE_NAME, token, {httpOnly: true});
  } catch (ex) {
    throw ex;
  }
}

export function deleteAuthCookie(res: express.Response) {
  res.clearCookie(COOKIE_NAME);
}