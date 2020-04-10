const dotenv = require('dotenv');
const dotenvLoaded = dotenv.load();

if (!dotenvLoaded || !dotenvLoaded.parsed) {
  console.warn('Warning: no .env file found.');
}
const data = dotenvLoaded?.parsed || {};

export const env = {
  ...data,
  JWT_SECRET:
    data.JWT_SECRET ||
    Array(24)
      .fill(0)
      .map(() => Math.random().toString(36).slice(2))
      .join(''),
};
