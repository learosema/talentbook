import { jwtSign, jwtVerify } from './security-helpers';
import { User } from './entities/user';
import { Identity } from './entities/identity';
import express from 'express';

const COOKIE_NAME = 'talentbook_authtoken';

// TODO: provide some nice JWT signoptions and some more cookie options.

export async function getAuthUser(req: express.Request): Promise<User|null> {
  if (req.cookies && typeof req.cookies[COOKIE_NAME] !== 'undefined') {
    try {
      const identity: Identity = <Identity>await jwtVerify(req.cookies[COOKIE_NAME]);
      return identity;
    } catch (ex) {
      return null;
    }
  }
  return null;
}

export async function setAuthCookie(res: express.Response, userName: string, fullName: string): Promise<void> {
  try {
    const identity = new Identity();
    identity.name = userName;
    identity.fullName = fullName;
    const token : string = await jwtSign(identity);
    res.cookie(COOKIE_NAME, token, {httpOnly: true, sameSite: true});
  } catch (ex) {
    throw ex;
  }
}

export function deleteAuthCookie(res: express.Response) {
  res.clearCookie(COOKIE_NAME);
}