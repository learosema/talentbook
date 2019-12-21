import { jwtSign, jwtVerify } from './security-helpers';
import { User } from './entities/user';
import { createIdentity, Identity } from './entities/identity';
import express from 'express';
import { getRepository } from 'typeorm';

const COOKIE_NAME = 'talentbook_authtoken';

// TODO: provide some nice JWT signoptions and some more cookie options.

export async function getAuthUser(req: express.Request): Promise<Identity|null> {
  if (req.cookies && typeof req.cookies[COOKIE_NAME] !== 'undefined') {
    try {
      const identity = <Identity>await jwtVerify(req.cookies[COOKIE_NAME]);
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        name: req.body.name
      });
      if (!user) {
        return null;
      }
      return identity;
    } catch (ex) {
      return null;
    }
  }
  return null;
}

export async function setAuthCookie(res: express.Response, userName: string, fullName: string): Promise<void> {
  try {
    const identity = createIdentity(userName, fullName);
    const token : string = await jwtSign(identity);
    res.cookie(COOKIE_NAME, token, {httpOnly: true, sameSite: true});
  } catch (ex) {
    throw ex;
  }
}

export function deleteAuthCookie(res: express.Response) {
  res.clearCookie(COOKIE_NAME);
}