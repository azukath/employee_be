import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListFilterDTO } from 'src/shared/dto/list-filter.dto';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from './dto/employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDTO) {
    return this.employeeService.create(dto);
  }

  @Post('/update')
  update(@Body() dto: UpdateEmployeeDTO) {
    return this.employeeService.update(dto);
  }

  @Get('/list')
  findAllPagingination(@Query() payload: ListFilterDTO) {
    return this.employeeService.getListPagination(payload);
  }

  @Get()
  findAll() {
    return this.employeeService.getList();
  }

  @Get('detail')
  findOne(@Query('employeeId') employeeId: string): Promise<EmployeeDTO> {
    return this.employeeService.detail(employeeId);
  }

  @Post('delete/:employeeId')
  delete(@Param('employeeId') employeeId: string) {
    return this.employeeService.delete(employeeId);
  }
}
