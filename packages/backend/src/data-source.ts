import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { UserSkill } from './entities/user-skill';
import { Skill } from './entities/skill';
import { PushMessage } from './entities/push-message';
import { Team } from './entities/team';
import { TeamMember } from './entities/team-member';
import { Activity } from './entities/activity';
import { Block } from './entities/block';
import { Follow } from './entities/follow';

if (process.env.DB_TYPE !== 'postgres') {
  throw new Error('unsupported db')
} 

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT||'', 10) || 5432,
  username: process.env.DB_USER || 'talentbook',
  password: process.env.DB_PW || 'talentbook',
  database: process.env.DB_NAME || 'talentbook',
  synchronize: true,
  logging: true,
  entities: [Activity, Block, Follow, User, UserSkill, Skill, Team, TeamMember, PushMessage],
  subscribers: [],
  migrations: [],
});