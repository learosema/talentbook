import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PushMessage {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  sender?: string;

  @Column()
  target?: string;

  @Column()
  message?: string;

  @Column()
  timestamp?: string;

  @Column()
  read?: boolean;
}
