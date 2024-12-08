import { EmployeeEntity } from 'src/modules/employee/entities/employee.entity';
import { BasedEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'leave' })
export class LeaveEntity extends BasedEntity {
  @Column({
    name: 'leave_id',
  })
  @Generated('uuid')
  leaveId: string;

  @Column()
  reason: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.leaves, {
    eager: true,
    persistence: false,
  })
  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'employeeId',
  })
  public employee: EmployeeEntity;
}
