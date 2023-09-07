import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { NoAuth } from 'src/auth/decorators/skip-auth.decorator';
import { RequestResetPasswordDto } from 'src/user/dtos/request-reset-password.dto';
import { ChangeUsernameDto } from 'src/user/dtos/change-username.dto';
import { RegisterUserDto } from 'src/user/dtos/register-user.dto';
import { ResetPasswordDto } from 'src/user/dtos/reset-password.dto';
import { ActivateUserDto } from 'src/user/dtos/activate-user.dto';
import { HttpResponse } from 'src/common/types/http-response.type';
import { AllowAccounts } from 'src/user/decorators/allow-accounts.decorator';
import { UserIdParamGuard } from 'src/user/guards/user-id-param.guard';
import { JwtRespone } from 'src/auth/types/jwt-response.type';
import { UserDataResponse } from 'src/user/types/user-data-response.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @NoAuth()
  @Post('register')
  async registerUser(
    @Body() dto: RegisterUserDto,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    return await this.userService.registerUser(dto);
  }

  @UseGuards(UserIdParamGuard)
  @AllowAccounts(['Unactivated'])
  @Post('activate/:userId')
  async activateUser(
    @Body() dto: ActivateUserDto,
    @Param('userId') userId: string,
  ): Promise<HttpResponse & UserDataResponse> {
    return await this.userService.activateUser(dto, userId);
  }

  @UseGuards(UserIdParamGuard)
  @AllowAccounts(['Unactivated'])
  @Post('email/activation-code/:userId')
  async requestActivationCode(
    @Param('userId') userId: string,
  ): Promise<HttpResponse> {
    return this.userService.requestActivationCode(userId);
  }

  @UseGuards(UserIdParamGuard)
  @Get(':userId')
  async getUser(
    @Param('userId') userId: string,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    return this.userService.getUser(userId);
  }

  @NoAuth()
  @Post('email/reset-password/')
  async requestResetPassword(
    @Body() dto: RequestResetPasswordDto,
  ): Promise<HttpResponse> {
    return this.userService.requestResetPassword(dto);
  }

  @NoAuth()
  @Patch('reset-password/:userId')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('userId') userId: string,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    return await this.userService.resetPassword(dto, userId);
  }

  @UseGuards(UserIdParamGuard)
  @AllowAccounts(['Active'])
  @Patch('username/:userId')
  async changeUsername(
    @Body() dto: ChangeUsernameDto,
    @Param('userId') userId: string,
  ): Promise<HttpResponse & UserDataResponse> {
    return await this.userService.changeUsername(dto, userId);
  }
}
