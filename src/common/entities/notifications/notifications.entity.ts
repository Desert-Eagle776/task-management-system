import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationTokenEntity } from './notification-token.entity';
import { StatusType } from 'src/common/constants';

@Entity({ name: 'notifications' })
export class NotificationsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'notification_token_id', referencedColumnName: 'id' })
  @ManyToOne(() => NotificationTokenEntity)
  notificationToken: NotificationTokenEntity;

  @Column()
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column()
  createdBy: string;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;
}
