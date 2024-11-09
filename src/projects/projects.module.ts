import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import {
  NotificationsEntity,
  NotificationTokenEntity,
  ProjectEntity,
  RolesEntity,
  UserEntity,
} from 'src/common';
import { RolesService } from 'src/roles/roles.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      UserEntity,
      RolesEntity,
      NotificationsEntity,
      NotificationTokenEntity,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    UsersService,
    AuthService,
    RolesService,
    NotificationsService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
