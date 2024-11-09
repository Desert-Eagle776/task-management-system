import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  NotificationsEntity,
  NotificationTokenEntity,
  RolesEntity,
  UserEntity,
} from 'src/common';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolesEntity,
      UserEntity,
      NotificationsEntity,
      NotificationTokenEntity,
    ]),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesGuard,
    AuthService,
    UsersService,
    NotificationsService,
    // {
    //   provide: APP_GUARD, // registration of the guard globally
    //   useClass: RolesGuard,
    // },
  ],
  exports: [RolesService],
})
export class RolesModule {}
