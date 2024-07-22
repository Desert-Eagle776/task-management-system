import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CompanyEntity } from 'src/companies/entities/company.entity';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { TaskStatusEntity } from './entities/task-status.entity';
import { RolesService } from 'src/roles/roles.service';
import { RolesEntity } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, UserEntity, CompanyEntity, ProjectEntity, TaskStatusEntity, RolesEntity])
  ],
  exports: [TasksService],
  controllers: [TasksController],
  providers: [TasksService, AuthService, UsersService, RolesService]
})
export class TasksModule { }
