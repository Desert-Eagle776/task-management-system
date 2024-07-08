import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesEntity } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    RolesEntity,
    UserEntity
  ])],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesGuard,
    AuthService,
    UsersService,
    // {
    //   provide: APP_GUARD, // registration of the guard globally
    //   useClass: RolesGuard,
    // },
  ],
  exports: [RolesService]
})
export class RolesModule { }
