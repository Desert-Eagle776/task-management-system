import { Body, Controller, Get, Param, Post, UseGuards, Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUser } from 'src/interfaces';
import { AuthService } from 'src/auth/auth.service';
import { IUserDataInToken } from './interfaces/user-payload';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Post('/register')
  registerUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Headers() headers: string): Promise<IUser> {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.usersService.getUserById(getDataFromToken);
  }
}
