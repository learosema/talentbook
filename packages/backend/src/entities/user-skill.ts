import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserSkill {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    userName!: string;

  @Column()
    skillName!: string;

  @Column()
    skillLevel!: string;

  @Column()
    willLevel!: string;
}
