import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const environment: Record<string, string> = {};
const localEnvironment: Record<string, string> = {};
const envLocalPath = path.resolve(process.cwd(), '.env.local');

dotenv.config({processEnv: environment});

if (fs.existsSync(envLocalPath)) {
  dotenv.config({path: envLocalPath, processEnv: localEnvironment});
}

Object.assign(process.env, Object.assign({}, environment, localEnvironment, process.env));