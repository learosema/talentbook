import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  public?: boolean;
}
