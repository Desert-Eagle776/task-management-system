import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  API_RESPONSE_MESSAGE,
  HandleHttpException,
  NotificationsEntity,
  NotificationTokenEntity,
  Response,
  StatusType,
  UserEntity,
} from 'src/common';
import { Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly NotificationsRepository: Repository<NotificationsEntity>,
    @InjectRepository(NotificationTokenEntity)
    private readonly NotificationTokenRepository: Repository<NotificationTokenEntity>,
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  async acceptPushNotification(
    user: UserEntity,
    notificationDto: NotificationDto,
  ): Promise<Response<NotificationTokenEntity>> {
    try {
      await this.NotificationTokenRepository.update(
        { user: { id: user.id } },
        { status: StatusType.INACTIVE },
      );

      const notificationToken = await this.NotificationTokenRepository.save({
        user,
        deviceType: notificationDto.deviceType,
        notificationToken: notificationDto.notificationToken,
        status: StatusType.ACTIVE,
      });

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: notificationToken,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async disablePushNotification(
    user: UserEntity,
    notificationDto: UpdateNotificationDto,
  ): Promise<void> {
    try {
      await this.NotificationTokenRepository.update(
        { user: { id: user.id }, deviceType: notificationDto.deviceType },
        { status: StatusType.INACTIVE },
      );
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getNotifications(): Promise<Response<NotificationsEntity[]>> {
    try {
      const notifications = await this.NotificationsRepository.find();
      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: notifications,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async sendPush(user: UserEntity, title: string, body: string) {
    try {
      const userInfo = await this.UserRepository.findOneBy({ id: user.id });
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      const notification = await this.NotificationTokenRepository.findOneBy({
        user: { id: user.id },
        status: StatusType.ACTIVE,
      });

      if (notification) {
        await this.NotificationsRepository.save({
          notificationToken: notification,
          title: title,
          body: body,
          status: StatusType.ACTIVE,
          createdBy: userInfo.firstName,
        });

        await firebase.messaging().send({
          notification: {
            title: title,
            body: body,
          },
          token: notification.notificationToken,
          android: { priority: 'high' },
        });
      }
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }
}
