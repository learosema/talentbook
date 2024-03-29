import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ unique: true })
    name?: string;

  @Column({ nullable: true })
    fullName?: string;

  @Column({ nullable: true })
    company?: string;

  @Column({ nullable: true })
    location?: string;

  @Column({ nullable: true })
    description?: string;

  @Column()
    email?: string;

  @Column({ nullable: true })
    passwordHash?: string;

  @Column({ nullable: true })
    githubUser?: string;

  @Column({ nullable: true })
    twitterHandle?: string;

  @Column({ nullable: true })
    pronouns?: string;

  @Column({ nullable: true })
    homepage?: string;

  @Column({ nullable: true })
    role?: string;
}
