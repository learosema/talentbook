import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TeamType {
  // a public group is visible to everybody and can be joined by everyone
  PUBLIC = 'public',

  // a closed group is visible to everybody but can only be joined on invitation
  CLOSED = 'closed',

  // a secret group is invisible to non-members and can only be joined on invitation
  SECRET = 'secret',
}

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ nullable: false, unique: true })
    name?: string;

  @Column({ nullable: true })
    description?: string;

  @Column({ nullable: true })
    homepage?: string;

  @Column({ nullable: true })
    tags?: string;

  @Column({ nullable: true })
    type?: string;
}
