import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import {
  UserEntity,
  RolesEntity,
  NotificationsEntity,
  NotificationTokenEntity,
} from 'src/common';
import { RolesService } from 'src/roles/roles.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RolesEntity,
      NotificationsEntity,
      NotificationTokenEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, RolesService, NotificationsService],
  exports: [UsersService],
})
export class UsersModule {}
