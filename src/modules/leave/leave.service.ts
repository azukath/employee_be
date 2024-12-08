import { BadRequestException, Injectable } from '@nestjs/common';
import { ListFilterDTO } from 'src/shared/dto/list-filter.dto';
import { ResponsePaginationDTO } from 'src/shared/dto/response-pagination';
import { SelectQueryBuilder } from 'typeorm';
import { CreateLeaveDTO } from './dto/create-leave.dto';
import { LeaveDTO } from './dto/leave.dto';
import { UpdateLeaveDTO } from './dto/update-leave.dto';
import { LeaveRepository } from './leave.repository';
import { LeaveEntity } from './entities/leave.entity';
import { EmployeeRepository } from '../employee/employee.repository';

@Injectable()
export class LeaveService {
  constructor(
    private leaveRepository: LeaveRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  private async toEntity(wrapper: LeaveDTO): Promise<LeaveEntity> {
    let entity = new LeaveEntity();

    // edit mode
    if (wrapper.leaveId) {
      entity = await this.leaveRepository.getByLeaveId(wrapper.leaveId);
    }

    entity.reason = wrapper.reason;
    entity.startDate = wrapper.startDate;
    entity.endDate = wrapper.endDate;

    if (wrapper.employeeId) {
      entity.employee = await this.employeeRepository.getByEmployeeIdActive(
        wrapper.employeeId,
      );
    }

    return entity;
  }

  private async toWrapper(entity: LeaveEntity): Promise<LeaveDTO> {
    const dto = new LeaveDTO();

    dto.reason = entity.reason;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.leaveId = entity.leaveId;
    if (entity.employee) {
      dto.employeeId = entity.employee.employeeId;
      dto.employeeFirstName = entity.employee.firstName;
      dto.employeeLastName = entity.employee.lastName;
    }

    return dto;
  }

  private async toWrapperList(entity: LeaveEntity[]): Promise<LeaveDTO[]> {
    return Promise.all(
      entity.map(async (item) => {
        return await this.toWrapper(item);
      }),
    );
  }

  async create(dto: CreateLeaveDTO): Promise<LeaveDTO> {
    try {
      const newDto = Object.assign(new LeaveDTO(), dto);
      delete newDto.leaveId;

      const checkTotalLeave = await this.validateTotalLeave(
        dto.employeeId,
        new Date(dto.startDate),
      );

      if (checkTotalLeave) {
        throw new BadRequestException(
          'Employee has reached maximum leave in month or year',
        );
      }

      const savedEntity = await this.leaveRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateLeaveDTO): Promise<LeaveDTO> {
    try {
      const newDto = Object.assign(new LeaveDTO(), dto);

      const checkTotalLeave = await this.validateTotalLeave(
        dto.employeeId,
        new Date(dto.startDate),
      );

      if (checkTotalLeave) {
        throw new BadRequestException(
          'Employee has reached maximum leave in month or year',
        );
      }

      const savedEntity = await this.leaveRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async getList(): Promise<LeaveDTO[]> {
    try {
      const list = await this.leaveRepository.find();
      return this.toWrapperList(list);
    } catch (error) {
      throw error;
    }
  }

  async delete(leaveId: string): Promise<boolean> {
    try {
      const data = await this.leaveRepository.getByLeaveIdActive(leaveId);
      // use soft delete
      await this.leaveRepository.softDelete(data.id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async detail(leaveId: string): Promise<LeaveDTO> {
    try {
      const data = await this.leaveRepository.getByLeaveIdActive(leaveId);
      return this.toWrapper(data);
    } catch (error) {
      throw error;
    }
  }

  async getListPagination(
    payload: ListFilterDTO,
  ): Promise<ResponsePaginationDTO<LeaveDTO>> {
    try {
      const { perPage, page, sort } = payload;

      let queryBuilder: SelectQueryBuilder<LeaveEntity>;
      queryBuilder = this.leaveRepository
        .createQueryBuilder('leave')
        .leftJoinAndSelect('leave.employee', 'employee');

      if (perPage) {
        queryBuilder = queryBuilder.take(perPage);
      }

      if (page && perPage) {
        queryBuilder = queryBuilder.skip((page - 1) * perPage);
      }

      const [results, totalResults] = await queryBuilder
        .orderBy('leave.createdAt', sort)
        .getManyAndCount();

      const ret = new ResponsePaginationDTO<LeaveDTO>();
      ret.data = await this.toWrapperList(results);
      ret.total = totalResults;
      ret.perPage = perPage;
      ret.page = page;

      return ret;
    } catch (error) {
      throw error;
    }
  }

  private async validateTotalLeave(
    employeeId: string,
    startDate: Date,
  ): Promise<boolean> {
    try {
      const yearStart = new Date(startDate.getFullYear(), 0, 1);
      const yearEnd = new Date(startDate.getFullYear(), 11, 31);

      const monthStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1,
      );
      const monthEnd = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
      );

      const totalLeaveInYear = await this.leaveRepository.getTotalLeave(
        employeeId,
        yearStart,
        yearEnd,
      );

      const totalLeaveInMonth = await this.leaveRepository.getTotalLeave(
        employeeId,
        monthStart,
        monthEnd,
      );

      return totalLeaveInYear >= 12 || totalLeaveInMonth >= 1;
    } catch (error) {
      throw error;
    }
  }
}
