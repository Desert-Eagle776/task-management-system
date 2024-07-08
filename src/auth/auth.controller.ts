import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IToken, IUser } from 'src/interfaces';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/registration')
  create(@Body() createAuthDto: CreateAuthDto): Promise<IUser> {
    return this.authService.registration(createAuthDto);
  }

  @Get('/login')
  login(@Body() loginAuthDto: LoginAuthDto): Promise<IToken> {
    return this.authService.login(loginAuthDto);
  }
}
