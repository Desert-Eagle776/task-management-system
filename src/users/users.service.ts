import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from 'src/interfaces';
import { AuthService } from 'src/auth/auth.service';
import { IUserDataInToken } from './interfaces/user-payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async createUser(dto: CreateUserDto) {
    const checkUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (checkUser) {
      throw new HttpException("The user with this email is already registered.", HttpStatus.CONFLICT);
    }

    const createUser = this.userRepository.create(dto);
    const saveUser = await this.userRepository.save(createUser);
    if (!saveUser) {
      throw new HttpException("Error saving data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return
  }

  async getUserById(userData: IUserDataInToken): Promise<IUser> {
    const user: IUser | undefined = await this.userRepository.findOne(
      {
        where: { id: userData.user_id },
        relations: ['company']
      });
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const isUserExists: IUser | undefined = await this.userRepository.findOne({
      where: { email },
      relations: ['company', 'roles']
    });

    return isUserExists;
  }
}
