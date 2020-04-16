import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
