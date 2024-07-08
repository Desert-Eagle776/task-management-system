import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { RolesEntity } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, UserEntity, RolesEntity])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, AuthService, RolesService],
  exports: [ProjectsService]
})
export class ProjectsModule { }
