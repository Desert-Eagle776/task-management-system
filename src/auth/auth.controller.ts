import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ParseIntPipe,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registration')
  @ApiOperation({
    summary: 'User registration',
    description:
      'This endpoint allows new users to register an account in the system by providing necessary details.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.registration(createAuthDto);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'User login',
    description:
      'This endpoint allows registered users to log into the system by providing valid credentials.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('/confirm')
  @ApiOperation({
    summary: 'User confirmation',
    description: 'This endpoint allows users to confirm their registration.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully confirmed.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  confirm(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('token') token: string,
  ) {
    return this.authService.confirm(userId, token);
  }
}
