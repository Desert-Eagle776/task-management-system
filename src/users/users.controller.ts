import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { IUserDataInToken } from './interfaces/user-payload';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) { }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Headers() headers: string): Promise<UserEntity> {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.usersService.getUserById(getDataFromToken);
  }
}
