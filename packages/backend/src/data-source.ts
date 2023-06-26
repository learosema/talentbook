import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { UserSkill } from './entities/user-skill';
import { Skill } from './entities/skill';
import { PushMessage } from './entities/push-message';
import { Team } from './entities/team';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgress',
  database: 'postgres',
  synchronize: true,
  logging: true,
  entities: [User, UserSkill, Skill, Team, PushMessage],
  subscribers: [],
  migrations: [],
});