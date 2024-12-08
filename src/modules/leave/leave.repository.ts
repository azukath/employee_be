import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LeaveEntity } from './entities/leave.entity';

@Injectable()
export class LeaveRepository extends Repository<LeaveEntity> {
  constructor(
    @InjectRepository(LeaveEntity)
    private readonly leaveRepository: Repository<LeaveEntity>,
  ) {
    super(
      leaveRepository.target,
      leaveRepository.manager,
      leaveRepository.queryRunner,
    );
  }

  async getListActive(): Promise<LeaveEntity[]> {
    return this.leaveRepository.find({
      withDeleted: true,
    });
  }

  async getByLeaveId(leaveId: string): Promise<LeaveEntity> {
    return this.leaveRepository.findOne({
      withDeleted: true,
      where: { leaveId: leaveId },
    });
  }

  async getByLeaveIdActive(leaveId: string): Promise<LeaveEntity> {
    return this.leaveRepository.findOne({
      where: { leaveId: leaveId },
    });
  }

  async getTotalLeave(
    employeeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.leaveRepository.count({
      where: {
        employee: { employeeId },
        startDate: Between(startDate, endDate),
      },
    });
  }
}
