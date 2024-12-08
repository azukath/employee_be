import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDTO } from './create-employee.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO) {
  @IsNotEmpty()
  @IsString()
  employeeId: string;
}
