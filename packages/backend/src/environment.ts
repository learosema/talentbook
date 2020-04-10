const dotenv = require('dotenv');
const dotenvLoaded = dotenv.load();

if (!dotenvLoaded) {
  console.warn('Warning: no .env file found.');
}

export const env = {
  ...dotenvLoaded.parsed,
  JWT_SECRET:
    dotenvLoaded.parsed.JWT_SECRET ||
    Array(24)
      .fill(0)
      .map((_) => Math.random().toString(36).slice(2))
      .join(''),
};
