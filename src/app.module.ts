import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './db/data-source';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    TasksModule,
    UsersModule,
    CompaniesModule,
    ProjectsModule,
    AuthModule,
    RolesModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
