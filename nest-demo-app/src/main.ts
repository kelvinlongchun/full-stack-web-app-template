import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(configService.get('general.PORT'));
}
bootstrap();

// dependencies
// @nestjs/config
// @nestjs/jwt
// @nestjs/mongoose
// @nestjs/passport
// bcrypt
// class-transformer
// class-validator
// mailgun-js
// mongoose
// passport
// passport-facebook
// passport-google-oauth20
// passport-jwt
// passport-local

// devDependencies
// @types/bcrypt
// @types/mailgun-js
// @types/passport-facebook
// @types/passport-jwt
// @types/passport-local
