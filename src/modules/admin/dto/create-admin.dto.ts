import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { Gender } from 'src/libs/enums/gender.enum';
import { ValidateSpesialCharacter } from 'src/libs/validation/spesial-character.validator';

export class CreateAdminDTO {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidateSpesialCharacter)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ValidateSpesialCharacter)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  password: string;
}
