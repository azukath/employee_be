import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListFilterDTO } from 'src/shared/dto/list-filter.dto';
import { AdminService } from './admin.service';
import { AdminDTO } from './dto/admin.dto';
import { UpdateAdminDTO } from './dto/update-admin.dto';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() dto: CreateAdminDTO) {
    return this.adminService.create(dto);
  }

  @Post('/update')
  update(@Body() dto: UpdateAdminDTO) {
    return this.adminService.update(dto);
  }

  @Get('/list')
  findAllPagingination(@Query() request: ListFilterDTO, @Req() req: Request) {
    const token: string = req.headers.authorization;
    const accessToken: string = token.split(' ')[1];
    const decoded: any = jwt.decode(accessToken, { complete: true });
    const payload = decoded.payload;

    return this.adminService.getListPagination(request, payload?.sub || '');
  }

  @Get()
  findAll() {
    return this.adminService.getList();
  }

  @Get('detail')
  findOne(@Query('adminId') adminId: string): Promise<AdminDTO> {
    return this.adminService.detail(adminId);
  }

  @Post('delete/:adminId')
  delete(@Param('adminId') adminId: string) {
    return this.adminService.delete(adminId);
  }
}
