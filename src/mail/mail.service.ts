import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailSubjects, UserEntity } from 'src/common';

@Injectable()
export class MailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailConfirmation(user: UserEntity) {
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const emailConfirmationUrl = this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    );
    const url = `${emailConfirmationUrl}?userId=${user.id}&token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '',
      subject: MailSubjects.CONFIRMATION,
      template: './confirmation',
      context: {
        url,
        name: user.firstName,
      },
    });
  }
}
