import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { UserDocument } from 'src/user/user.schema';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth.guard';
import { FacebookAuthGuard } from 'src/auth/guards/facebook-auth.guard';
import { LoginUserDto } from 'src/auth/dtos/login-user.dto';
import { GoogleAuthDto } from 'src/auth/dtos/google-auth.dto';
import { FacebookAuthDto } from 'src/auth/dtos/facebook-auth.dto';
import { NoAuth } from 'src/auth/decorators/skip-auth.decorator';
import { JwtRespone } from 'src/auth/types/jwt-response.type';

@NoAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @Req() req: { user: UserDocument },
    @Body() _dto: LoginUserDto, // For data validation only.
  ): Promise<JwtRespone> {
    return await this.authService.loginUser(req.user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(
    @Req() req: { user: GoogleAuthDto },
    @Res() res: Response,
  ): Promise<void> {
    return await this.authService.googleAuth(req.user, res);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth(
    @Req() req: { user: FacebookAuthDto },
    @Res() res: Response,
  ): Promise<void> {
    return await this.authService.facebookAuth(req.user, res);
  }
}
