import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users';
import { StatusType } from 'src/common/constants';

@Entity({ name: 'notification_tokens' })
export class NotificationTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  deviceType: string;

  @Column()
  notificationToken: string;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;
}
