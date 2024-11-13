import { Global, Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GOOGLE_MAIL_APP_EMAIL,
          pass: process.env.GOOGLE_MAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
      },
      options: {
        strict: true,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
