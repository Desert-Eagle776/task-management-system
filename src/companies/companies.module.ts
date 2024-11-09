import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import {
  CompanyEntity,
  NotificationsEntity,
  NotificationTokenEntity,
  RolesEntity,
  UserEntity,
} from 'src/common';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      UserEntity,
      RolesEntity,
      NotificationsEntity,
      NotificationTokenEntity,
    ]),
  ],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    AuthService,
    UsersService,
    NotificationsService,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
