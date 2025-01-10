import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleHttpException, UserEntity } from 'src/common';
import { Repository } from 'typeorm';
import {
  RolesEntity,
  API_RESPONSE_MESSAGE,
  FamilyRoles,
  IToken,
  Response,
} from 'src/common';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) {}

  async registration(
    createAuthDto: CreateAuthDto,
  ): Promise<Response<UserEntity>> {
    try {
      const isUserExists = await this.usersService.getUserByEmail(
        createAuthDto.email,
      );
      if (isUserExists) {
        throw new ConflictException('The user with this email already exists');
      }

      const hashPassword = await argon2.hash(createAuthDto.password);

      const role = await this.rolesRepository.findOne({
        where: { name: FamilyRoles.User },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const createUser = this.userRepository.create({
        ...createAuthDto,
        password: hashPassword,
        roles: role,
      });
      const saveUser = await this.userRepository.save(createUser);

      await this.mailService.sendEmailConfirmation(saveUser);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: saveUser,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async login(loginAuthDto: LoginAuthDto): Promise<Response<IToken>> {
    try {
      const isUserExists = await this.userRepository.findOne({
        where: { email: loginAuthDto.email },
        select: ['id', 'email', 'password', 'token'],
        relations: ['roles'],
      });
      if (!isUserExists) {
        throw new ConflictException('Incorrect email or password');
      }

      const validPassword = await argon2.verify(
        isUserExists.password,
        loginAuthDto.password,
      );
      if (!validPassword) {
        throw new ConflictException('Incorrect email or password');
      }

      const token = await this.generateToken(isUserExists);

      isUserExists.token = token.token;
      await this.userRepository.save(isUserExists);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: token,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async confirm(userId: number, token: string): Promise<Response<any>> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isEmailConfirmed) {
        throw new ConflictException('Email already confirmed');
      }

      const checkToken = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      if (!checkToken) {
        throw new ConflictException('Invalid token');
      }

      await this.userRepository.update(
        { id: userId },
        {
          isEmailConfirmed: true,
        },
      );

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: null,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  public async validateToken(token: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ token });
    if (!user) {
      throw new ForbiddenException('Invalid token');
    }

    return user;
  }

  private async generateToken(user: UserEntity): Promise<IToken> {
    const payload = {
      user_id: user.id,
      email: user.email,
      roles: [user.roles.name],
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  public getUserDataFromToken(token: string) {
    const decodedUser = this.jwtService.decode(token);
    return decodedUser;
  }

  private generateVerificationCode(length = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }
}
