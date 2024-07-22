import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { RolesEntity } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolesEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, RolesService],
  exports: [UsersService]
})
export class UsersModule { }
