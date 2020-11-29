import jsonwebtoken from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  Array(24)
    .fill(0)
    .map(() => Math.random().toString(36).slice(2))
    .join('');

/**
 * Sign a JWT, read secret from .env file
 *
 * @param payload the payload object
 * @param options the options
 * @returns promise
 */
export function jwtSign(
  payload: string | object | Buffer,
  options: jsonwebtoken.SignOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(payload, JWT_SECRET, options, (err, encoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encoded || '');
    });
  });
}

/**
 * Verify a JWT, read secret from .env file
 *
 * @param token
 * @param options
 */
export function jwtVerify(
  token: string,
  options: jsonwebtoken.SignOptions = {}
): Promise<string | object | Buffer> {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, JWT_SECRET, options, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded || '');
    });
  });
}
