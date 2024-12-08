import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository extends Repository<EmployeeEntity> {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) {
    super(
      employeeRepository.target,
      employeeRepository.manager,
      employeeRepository.queryRunner,
    );
  }

  async getListActive(): Promise<EmployeeEntity[]> {
    return this.employeeRepository.find({
      withDeleted: true,
    });
  }

  async getByEmployeeId(employeeId: string): Promise<EmployeeEntity> {
    return this.employeeRepository.findOne({
      withDeleted: true,
      where: { employeeId: employeeId },
    });
  }

  async getByEmployeeIdActive(employeeId: string): Promise<EmployeeEntity> {
    return this.employeeRepository.findOneOrFail({
      where: { employeeId: employeeId },
    });
  }

  async getByEmail(email: string): Promise<EmployeeEntity> {
    return this.employeeRepository.findOne({
      withDeleted: true,
      where: { email: email },
    });
  }
}
