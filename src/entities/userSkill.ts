import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class UserSkill {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  skillId!: string;

  @Column()
  skillLevel!: string;

  @Column()
  willLevel!: string;

}
