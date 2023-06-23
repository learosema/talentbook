import { jwtSign, jwtVerify } from './security-helpers';
import { User } from './entities/user';
import { createIdentity, Identity } from './entities/identity';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';

const COOKIE_NAME = 'talentbook_authtoken';

export async function getAuthUser(req: Request): Promise<Identity | null> {
  if (req.cookies && typeof req.cookies[COOKIE_NAME] !== 'undefined') {
    try {
      const identity = <Identity>await jwtVerify(req.cookies[COOKIE_NAME]);
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({where: {
        name: identity.name,
      }});
      if (!user) {
        return null;
      }
      identity.fullName = user.fullName || '';
      identity.role = user.role || 'user';
      return identity;
    } catch (ex: any) {
      return null;
    }
  }
  return null;
}

export async function setAuthCookie(
  res: Response,
  userName: string,
  fullName: string,
  role: string = 'user'
): Promise<void> {
  try {
    const identity = createIdentity(userName, fullName, role);
    const token: string = await jwtSign(identity);
    res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: true });
  } catch (ex: any) {
    throw ex;
  }
}

export function deleteAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME);
}
