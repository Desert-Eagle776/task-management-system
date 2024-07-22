import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { RolesEntity } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, UserEntity, RolesEntity])
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, AuthService, UsersService],
  exports: [CompaniesService]
})
export class CompaniesModule { }
