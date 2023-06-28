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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'talentbook',
  password: process.env.POSTGRES_PW || 'talentbook',
  database: process.env.POSTGRES_DB || 'talentbook',
  synchronize: true,
  logging: true,
  entities: [Activity, Block, Follow, User, UserSkill, Skill, Team, TeamMember, PushMessage],
  subscribers: [],
  migrations: [],
});