import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({unique: true})
  name?: string;

  @Column({nullable: true})
  location?: string;

  @Column() 
  email?: string;

  @Column({nullable: true})
  passwordHash?: string;

  @Column({nullable: true})
  fullName?: string;

  @Column({nullable: true})
  githubUser?:string;

}
