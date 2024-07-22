import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IToken } from 'src/auth/interfaces/token.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/registration')
  create(@Body() createAuthDto: CreateAuthDto): Promise<UserEntity> {
    return this.authService.registration(createAuthDto);
  }

  @Get('/login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<IToken> {
    return this.authService.login(loginAuthDto);
  }
}
