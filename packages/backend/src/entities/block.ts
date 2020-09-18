import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  user?: string;

  @Column({ nullable: false })
  target?: string;
}
