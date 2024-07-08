import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ICreateUser, IRole, IToken, IUser } from 'src/interfaces';
import { UserPayload } from 'src/users/interfaces/user-payload';
import { RolesEntity } from 'src/roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>
  ) { }

  async registration(createAuthDto: CreateAuthDto): Promise<IUser> {
    const isUserExists: IUser | null = await this.usersService.getUserByEmail(createAuthDto.email);
    if (isUserExists) {
      throw new HttpException("The user with this email already exists.", HttpStatus.CONFLICT);
    }

    const hashPassword: string = await argon2.hash(createAuthDto.password);

    const role: IRole = await this.rolesRepository.findOne({ where: { name: 'user' } });
    if (!role) {
      throw new HttpException("Role 'user' not found.", HttpStatus.NOT_FOUND);
    }

    const createUser: ICreateUser = this.userRepository.create({
      ...createAuthDto, password: hashPassword, roles: role
    });
    const saveUser: IUser = await this.userRepository.save(createUser);
    if (!saveUser) {
      throw new HttpException("Error saving data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return saveUser;
  }

  async login(loginAuthDto: LoginAuthDto): Promise<IToken> {
    const isUserExists: IUser | null = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
      select: ['id', 'email', 'password'],
      relations: ['roles'],
    });
    if (!isUserExists) {
      throw new HttpException("Incorrect email or password.", HttpStatus.CONFLICT);
    }

    const validPassword: boolean = await argon2.verify(isUserExists.password, loginAuthDto.password);
    if (!validPassword) {
      throw new HttpException("Incorrect email or password.", HttpStatus.CONFLICT);
    }

    const token: IToken = await this.generateToken(isUserExists);
    return token;
  }

  private async generateToken(user: IUser): Promise<IToken> {
    const payload: UserPayload = { user_id: user.id, email: user.email, roles: [user.roles.name] };
    console.log(payload);
    return {
      token: this.jwtService.sign(payload),
    };
  }

  public getUserDataFromToken(token: string) {
    const decodedUser = this.jwtService.decode(token);
    console.log(decodedUser);
    return decodedUser;
  }
}
