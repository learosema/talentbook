import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryColumn()
  name?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  homepage?: string;
}
