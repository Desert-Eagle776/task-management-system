import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import {
  RolesEntity,
  TaskEntity,
  UserEntity,
  CompanyEntity,
  ProjectEntity,
  TaskStatusEntity,
} from 'src/common';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      UserEntity,
      CompanyEntity,
      ProjectEntity,
      TaskStatusEntity,
      RolesEntity,
    ]),
    NotificationsModule,
  ],
  exports: [TasksService],
  controllers: [TasksController],
  providers: [TasksService, AuthService, UsersService, RolesService],
})
export class TasksModule {}
