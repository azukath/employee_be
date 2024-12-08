import { Injectable } from '@nestjs/common';
import { ListFilterDTO } from 'src/shared/dto/list-filter.dto';
import { ResponsePaginationDTO } from 'src/shared/dto/response-pagination';
import { SelectQueryBuilder } from 'typeorm';
import { CreateEmployeeDTO } from './dto/create-employee.dto';
import { EmployeeDTO } from './dto/employee.dto';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeEntity } from './entities/employee.entity';
import { LeaveDTO } from '../leave/dto/leave.dto';

@Injectable()
export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  private async toEntity(wrapper: EmployeeDTO): Promise<EmployeeEntity> {
    let entity = new EmployeeEntity();

    // edit mode
    if (wrapper.employeeId) {
      entity = await this.employeeRepository.getByEmployeeId(
        wrapper.employeeId,
      );
    }

    entity.firstName = wrapper.firstName;
    entity.lastName = wrapper.lastName;
    entity.email = wrapper.email;
    entity.phoneNumber = wrapper.phoneNumber;
    entity.address = wrapper.address;
    entity.gender = wrapper.gender;

    return entity;
  }

  private async toWrapper(entity: EmployeeEntity): Promise<EmployeeDTO> {
    const dto = new EmployeeDTO();

    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.phoneNumber = entity.phoneNumber;
    dto.address = entity.address;
    dto.gender = entity.gender;
    dto.employeeId = entity.employeeId;

    const listLeave = await entity.leaves;
    if (listLeave.length) {
      dto.leaveList = listLeave.map((item) => {
        return {
          leaveId: item.leaveId,
          reason: item.reason,
          startDate: item.startDate,
          endDate: item.endDate,
        };
      }) as LeaveDTO[];
    }

    return dto;
  }

  private async toWrapperList(
    entity: EmployeeEntity[],
  ): Promise<EmployeeDTO[]> {
    return Promise.all(
      entity.map(async (item) => {
        return await this.toWrapper(item);
      }),
    );
  }

  async create(dto: CreateEmployeeDTO): Promise<EmployeeDTO> {
    try {
      const newDto = Object.assign(new EmployeeDTO(), dto);

      delete newDto.employeeId;

      // validate if email has been soft deleted
      const data = await this.employeeRepository.getByEmail(newDto.email);
      if (data) {
        newDto.employeeId = data.employeeId;
        await this.employeeRepository.restore(data.id);
      }

      const savedEntity = await this.employeeRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateEmployeeDTO): Promise<EmployeeDTO> {
    try {
      const newDto = Object.assign(new EmployeeDTO(), dto);

      const savedEntity = await this.employeeRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async getList(): Promise<EmployeeDTO[]> {
    try {
      const list = await this.employeeRepository.find();
      return this.toWrapperList(list);
    } catch (error) {
      throw error;
    }
  }

  async delete(employeeId: string): Promise<boolean> {
    try {
      const data =
        await this.employeeRepository.getByEmployeeIdActive(employeeId);
      // use soft delete
      await this.employeeRepository.softDelete(data.id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async detail(employeeId: string): Promise<EmployeeDTO> {
    try {
      const data =
        await this.employeeRepository.getByEmployeeIdActive(employeeId);
      return this.toWrapper(data);
    } catch (error) {
      throw error;
    }
  }

  async getListPagination(
    payload: ListFilterDTO,
  ): Promise<ResponsePaginationDTO<EmployeeDTO>> {
    try {
      const { perPage, page, sort, search } = payload;

      let queryBuilder: SelectQueryBuilder<EmployeeEntity>;
      queryBuilder = this.employeeRepository.createQueryBuilder('employee');

      if (search) {
        queryBuilder = queryBuilder.andWhere(
          'employee.first_name LIKE :first_name',
          {
            first_name: '%' + search + '%',
          },
        );
      }

      if (perPage) {
        queryBuilder = queryBuilder.take(perPage);
      }

      if (page && perPage) {
        queryBuilder = queryBuilder.skip((page - 1) * perPage);
      }

      const [results, totalResults] = await queryBuilder
        .orderBy('employee.created_at', sort)
        .getManyAndCount();

      const ret = new ResponsePaginationDTO<EmployeeDTO>();
      ret.data = await this.toWrapperList(results);
      ret.total = totalResults;
      ret.perPage = perPage;
      ret.page = page;

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
