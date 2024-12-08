import { Injectable } from '@nestjs/common';
import { HashHelper } from 'src/helpers/hash.helper';
import { AdminRepository } from './admin.repository';
import { AdminDTO } from './dto/admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { UpdateAdminDTO } from './dto/update-admin.dto';
import { ListFilterDTO } from 'src/shared/dto/list-filter.dto';
import { ResponsePaginationDTO } from 'src/shared/dto/response-pagination';
import { Not, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  private async toEntity(wrapper: AdminDTO): Promise<AdminEntity> {
    let entity = new AdminEntity();

    // edit mode
    if (wrapper.adminId) {
      entity = await this.adminRepository.getByAdminId(wrapper.adminId);
    }

    entity.dateOfBirth = wrapper.dateOfBirth;
    entity.email = wrapper.email;
    entity.firstName = wrapper.firstName;
    entity.lastName = wrapper.lastName;
    entity.gender = wrapper.gender;

    if (wrapper.password) {
      entity.password = await HashHelper.encrypt(wrapper.password);
    }

    return entity;
  }

  private async toWrapper(entity: AdminEntity): Promise<AdminDTO> {
    const dto = new AdminDTO();

    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.dateOfBirth = entity.dateOfBirth;
    dto.gender = entity.gender;
    dto.adminId = entity.adminId;

    return dto;
  }

  private async toWrapperList(entity: AdminEntity[]): Promise<AdminDTO[]> {
    return Promise.all(
      entity.map(async (item) => {
        return await this.toWrapper(item);
      }),
    );
  }

  async create(dto: CreateAdminDTO): Promise<AdminDTO> {
    try {
      const newDto = Object.assign(new AdminDTO(), dto);

      delete newDto.adminId;

      // validate if email has been soft deleted
      const data = await this.adminRepository.getByEmail(newDto.email);
      if (data) {
        newDto.adminId = data.adminId;
        await this.adminRepository.restore(data.id);
      }

      const savedEntity = await this.adminRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async update(dto: UpdateAdminDTO): Promise<AdminDTO> {
    try {
      const newDto = Object.assign(new AdminDTO(), dto);

      const savedEntity = await this.adminRepository.save(
        await this.toEntity(newDto),
      );
      return this.toWrapper(savedEntity);
    } catch (error) {
      throw error;
    }
  }

  async getList(): Promise<AdminDTO[]> {
    try {
      const list = await this.adminRepository.find();
      return this.toWrapperList(list);
    } catch (error) {
      throw error;
    }
  }

  async delete(adminId: string): Promise<boolean> {
    try {
      const data = await this.adminRepository.getByAdminIdActive(adminId);
      // use soft delete
      await this.adminRepository.softDelete(data.id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async detail(adminId: string): Promise<AdminDTO> {
    try {
      const data = await this.adminRepository.getByAdminIdActive(adminId);
      return this.toWrapper(data);
    } catch (error) {
      throw error;
    }
  }

  async getListPagination(
    payload: ListFilterDTO,
    id: string,
  ): Promise<ResponsePaginationDTO<AdminDTO>> {
    try {
      const { perPage, page, sort, search } = payload;

      let queryBuilder: SelectQueryBuilder<AdminEntity>;
      queryBuilder = this.adminRepository
        .createQueryBuilder('admin')
        .where({ adminId: Not(id) });

      if (search) {
        queryBuilder = queryBuilder.andWhere(
          'admin.first_name LIKE :first_name',
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
        .orderBy('admin.created_at', sort)
        .getManyAndCount();

      const ret = new ResponsePaginationDTO<AdminDTO>();
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
