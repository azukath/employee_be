import { Gender } from 'src/libs/enums/gender.enum';
import { LeaveEntity } from 'src/modules/leave/entities/leave.entity';
import { BasedEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Generated, JoinTable, OneToMany } from 'typeorm';

@Entity({ name: 'employee' })
export class EmployeeEntity extends BasedEntity {
  @Column({
    name: 'employee_id',
    unique: true,
  })
  @Generated('uuid')
  employeeId: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @OneToMany(() => LeaveEntity, (leave) => leave.employee)
  @JoinTable({
    joinColumn: { name: 'leaves', referencedColumnName: 'leave_id' },
  })
  public leaves!: Promise<LeaveEntity[]>;
}
