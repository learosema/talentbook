import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { UserSkill } from './entities/user-skill';
import { Skill } from './entities/skill';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: true,
  entities: [User, UserSkill, Skill],
  subscribers: [],
  migrations: [],
});