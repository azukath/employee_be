import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LeaveDTO {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  leaveId: string;

  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsString()
  employeeFirstName: string;

  @IsString()
  employeeLastName: string;
}
