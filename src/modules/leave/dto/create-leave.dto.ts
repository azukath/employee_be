import { IsDateString, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsGreaterDate } from 'src/libs/validation/is-greater-date.validator';
import { ValidateSpesialCharacter } from 'src/libs/validation/spesial-character.validator';

export class CreateLeaveDTO {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidateSpesialCharacter)
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsGreaterDate({
    message: 'endDate must be greater than or equal to startDate',
  })
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  employeeId: string;
}
