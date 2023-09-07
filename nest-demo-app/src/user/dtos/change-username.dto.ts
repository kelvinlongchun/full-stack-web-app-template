import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsAlphanumeric,
} from 'class-validator';

export class ChangeUsernameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(12)
  @IsAlphanumeric()
  username: string;
}
