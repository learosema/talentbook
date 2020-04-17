import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TeamMemberRole {
  ADMIN = 'admin',
  USER = 'user',
  INVITED = 'invited',
  REQUESTED = 'requested',
  BANNED = 'banned',
}

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userName?: string;

  @Column()
  userRole?: string;

  @Column()
  teamName?: string;
}
