import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { IToken } from 'src/auth/interfaces/token.interface';
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

  async registration(createAuthDto: CreateAuthDto): Promise<UserEntity> {
    const isUserExists: UserEntity = await this.usersService.getUserByEmail(createAuthDto.email);
    if (isUserExists) {
      throw new HttpException("The user with this email already exists", HttpStatus.CONFLICT);
    }

    const hashPassword: string = await argon2.hash(createAuthDto.password);

    const role: RolesEntity = await this.rolesRepository.findOne({ where: { name: 'user' } });
    if (!role) {
      throw new HttpException("Role 'user' not found", HttpStatus.NOT_FOUND);
    }

    const createUser: UserEntity = this.userRepository.create({
      ...createAuthDto, password: hashPassword, roles: role
    });
    const saveUser: UserEntity = await this.userRepository.save(createUser);

    return saveUser;
  }

  async login(loginAuthDto: LoginAuthDto): Promise<IToken> {
    const isUserExists: UserEntity = await this.userRepository.findOne({
      where: { email: loginAuthDto.email },
      select: ['id', 'email', 'password', 'token'],
      relations: ['roles'],
    });
    if (!isUserExists) {
      throw new HttpException("Incorrect email or password", HttpStatus.CONFLICT);
    }

    const validPassword: boolean = await argon2.verify(isUserExists.password, loginAuthDto.password);
    if (!validPassword) {
      throw new HttpException("Incorrect email or password", HttpStatus.CONFLICT);
    }

    const token: IToken = await this.generateToken(isUserExists);

    isUserExists.token = token.token;
    await this.userRepository.save(isUserExists);

    return token;
  }

  public async validateToken(token: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOneBy({ token });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  private async generateToken(user: UserEntity): Promise<IToken> {
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
