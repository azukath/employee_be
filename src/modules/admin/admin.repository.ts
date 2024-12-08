import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {
    super(
      adminRepository.target,
      adminRepository.manager,
      adminRepository.queryRunner,
    );
  }

  async getListActive(): Promise<AdminEntity[]> {
    return this.adminRepository.find({
      withDeleted: true,
    });
  }

  async getByAdminId(adminId: string): Promise<AdminEntity> {
    return this.adminRepository.findOne({
      withDeleted: true,
      where: { adminId: adminId },
    });
  }

  async getByAdminIdActive(adminId: string): Promise<AdminEntity> {
    return this.adminRepository.findOne({
      where: { adminId: adminId },
    });
  }

  async getByEmail(email: string): Promise<AdminEntity> {
    return this.adminRepository.findOne({
      withDeleted: true,
      where: { email: email },
    });
  }
}
