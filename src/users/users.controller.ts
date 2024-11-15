import {
  Controller,
  Get,
  UseGuards,
  Headers,
  HttpStatus,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateNotificationDto } from 'src/notifications/dto/update-notification.dto';
import { NotificationDto } from 'src/notifications/dto/create-notification.dto';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'This endpoint retrieves the profile information of the currently authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user profile has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified user could not be found',
  })
  profile(@Headers() headers: string) {
    const token = headers['authorization'].split(' ')[1];
    const getDataFromToken = this.authService.getUserDataFromToken(token);

    return this.usersService.getUserById(getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/push/enable')
  @ApiOperation({
    summary: 'Enable push notifications for a user',
    description:
      'This endpoint allows enabling push notifications for a specified user by saving their notification preferences.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push notifications successfully enabled for the user.',
  })
  async enablePush(
    @Param('id', ParseIntPipe) userId: number,
    @Body() notificationDto: NotificationDto,
  ) {
    return this.usersService.enablePush(userId, notificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/push/disable')
  @ApiOperation({
    summary: 'Disable push notifications for a user',
    description:
      'This endpoint disables push notifications for a specified user by updating their notification preferences.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Push notifications successfully disabled for the user.',
  })
  async disablePush(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.usersService.disablePush(userId, updateNotificationDto);
  }
}
