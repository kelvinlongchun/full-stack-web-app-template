import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  IsEmail,
  IsString,
} from 'class-validator';
import { ContainAlpha } from 'src/common/decorators/contain-alpha.decorator';
import { ContainNumber } from 'src/common/decorators/contain-number.decorator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(12)
  @IsAlphanumeric()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @ContainNumber()
  @ContainAlpha()
  password: string;
}
