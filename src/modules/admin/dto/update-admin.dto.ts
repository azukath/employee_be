import { PartialType } from '@nestjs/mapped-types';
import { AdminDTO } from './admin.dto';

export class UpdateAdminDTO extends PartialType(AdminDTO) {}
