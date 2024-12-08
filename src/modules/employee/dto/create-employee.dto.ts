import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { Gender } from 'src/libs/enums/gender.enum';
import { ValidateSpesialCharacter } from 'src/libs/validation/spesial-character.validator';

export class CreateEmployeeDTO {
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
  @IsString()
  @Validate(ValidateSpesialCharacter)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ValidateSpesialCharacter)
  address: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
