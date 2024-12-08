import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveDTO } from './create-leave.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLeaveDTO extends PartialType(CreateLeaveDTO) {
  @IsNotEmpty()
  @IsString()
  leaveId: string;
}
