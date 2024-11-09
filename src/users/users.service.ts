import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  IUserDataInToken,
  Response,
  API_RESPONSE_MESSAGE,
  HandleHttpException,
} from 'src/common';
import { NotificationDto } from 'src/notifications/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/notifications/dto/update-notification.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserById(userData: IUserDataInToken): Promise<Response<UserEntity>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userData.user_id },
        relations: ['company'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: user,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async enablePush(
    userId: number,
    notificationDto: NotificationDto,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      return this.notificationsService.acceptPushNotification(
        user,
        notificationDto,
      );
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async disablePush(
    userId: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      await this.notificationsService.disablePushNotification(
        user,
        updateNotificationDto,
      );
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const isUserExists: UserEntity = await this.userRepository.findOne({
      where: { email },
      relations: ['company', 'roles'],
    });

    return isUserExists;
  }
}
