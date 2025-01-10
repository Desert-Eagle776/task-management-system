import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  username: configService.get<string>('POSTGRES_USER'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
  logging: true,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
