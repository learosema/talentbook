import { Entity, Column } from 'typeorm';

@Entity()
export class PushMessage {
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
