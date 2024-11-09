import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import {
  NotificationsEntity,
  NotificationTokenEntity,
  UserEntity,
} from 'src/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationsEntity,
      NotificationTokenEntity,
      UserEntity,
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
