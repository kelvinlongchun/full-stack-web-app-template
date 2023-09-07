import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ContainNumber } from 'src/common/decorators/contain-number.decorator';
import { ContainAlpha } from 'src/common/decorators/contain-alpha.decorator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @ContainNumber()
  @ContainAlpha()
  password: string;
}
