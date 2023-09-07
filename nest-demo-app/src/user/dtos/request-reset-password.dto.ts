import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;
}
