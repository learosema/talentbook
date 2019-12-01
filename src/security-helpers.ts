import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
const dotenv = require('dotenv');
const dotenvLoaded = dotenv.load();

if (!dotenvLoaded) {
  throw Error('Warning: no .env file found.');
}

const env = dotenvLoaded.parsed;

/**
 * Generate a salted hash, read salt from .env file
 * 
 * @param str 
 * @returns {string} hexadecimal hash string
 */
export function hash(str: string): string {
  return crypto.createHash('sha256').update(str + env.SALT).digest('hex');
}

/**
 * Sign a JWT, read secret from .env file
 * 
 * @param payload the payload object
 * @param options the options
 * @returns promise
 */
export function jwtSign(payload: string|object|Buffer, 
  options: jsonwebtoken.SignOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
    jsonwebtoken.sign(payload, env.JWT_SECRET, options,
      (err:Error, encoded: string) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encoded);
    });
  });
}

/**
 * Verify a JWT, read secret from .env file
 * 
 * @param token 
 * @param options 
 */
export function jwtVerify(token: string, 
  options: jsonwebtoken.SignOptions = {}): Promise<string|object|Buffer> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, env.JWT_SECRET, options, 
      (err:Error, decoded: string|object|Buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}

