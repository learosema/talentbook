import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ nullable: false })
    user?: string;

  @Column({ nullable: false })
    type?: string;

  @Column({ nullable: false })
    target?: string;

  @Column({ nullable: false })
    time?: string;
}
