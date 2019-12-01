/*  That doesnt work. So we are not using it for now.


import express from 'express';
import { getUser } from './auth-helper';

export const authMiddleware: express.RequestHandler = async (req, res, next) => {
  req.user = await getUser(req);
  next();
} 
*/
