import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from 'src/email/email.module';
import { RandomModule } from 'src/random/random.module';
import { UserController } from '../controllers/user.controller';
import { UserService } from './user.service';
import { ThirdPartyUser } from './providers/third-party-user.provider';
import { UserEmail } from './providers/user-email.provider';
import { User, UserSchema } from './user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { EmailRecord, EmailSchema } from 'src/email/email-record.schema';
import { ResetUserPassword } from './providers/reset-user-password.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailRecord.name, schema: EmailSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('user.RESET_PASSWORD_JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('user.RESET_PASSWORD_JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    EmailModule,
    RandomModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, ThirdPartyUser, UserEmail, ResetUserPassword],
  exports: [UserService],
})
export class UserModule {}
