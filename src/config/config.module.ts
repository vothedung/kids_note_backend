import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import authConfig from './auth.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import storageConfig from './storage.config';
import emailConfig from './email.config';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig, storageConfig, emailConfig],
      validationSchema,
      validationOptions: { abortEarly: false },
    }),
  ],
})
export class ConfigModule {}
