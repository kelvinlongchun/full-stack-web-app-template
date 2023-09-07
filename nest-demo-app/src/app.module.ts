import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { RandomModule } from './random/random.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountStatusGuard } from './user/guards/account-status.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import generalConfig from './config/general.config';
import mongodbConfig from './config/mongodb.config';
import mailgunConfig from './config/mailgun.config';
import authConfig from './config/auth.config';
import userConfig from './config/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        generalConfig,
        mongodbConfig,
        mailgunConfig,
        authConfig,
        userConfig,
      ],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodb.MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    RandomModule,
    EmailModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountStatusGuard,
    },
  ],
})
export class AppModule {}
