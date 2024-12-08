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
import { LeaveService } from './leave.service';
import { LeaveDTO } from './dto/leave.dto';
import { UpdateLeaveDTO } from './dto/update-leave.dto';
import { CreateLeaveDTO } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(@Body() dto: CreateLeaveDTO) {
    return this.leaveService.create(dto);
  }

  @Post('update')
  update(@Body() dto: UpdateLeaveDTO) {
    return this.leaveService.update(dto);
  }

  @Get('/list')
  findAllPagingination(@Query() payload: ListFilterDTO) {
    return this.leaveService.getListPagination(payload);
  }

  @Get()
  findAll() {
    return this.leaveService.getList();
  }

  @Get('detail')
  findOne(@Query('leaveId') leaveId: string): Promise<LeaveDTO> {
    return this.leaveService.detail(leaveId);
  }

  @Post('delete/:leaveId')
  delete(@Param('leaveId') leaveId: string) {
    return this.leaveService.delete(leaveId);
  }
}
