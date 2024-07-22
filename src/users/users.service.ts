import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IUserDataInToken } from './interfaces/user-payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async getUserById(userData: IUserDataInToken): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne(
      {
        where: { id: userData.user_id },
        relations: ['company']
      });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const isUserExists: UserEntity = await this.userRepository.findOne({
      where: { email },
      relations: ['company', 'roles']
    });

    return isUserExists;
  }
}
