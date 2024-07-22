import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesEntity } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolesEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtAuthGuard, RolesService],
  exports: [AuthService]
})
export class AuthModule { }
