import { Exclude } from 'class-transformer';
import { Gender } from 'src/libs/enums/gender.enum';
import { BasedEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, Generated } from 'typeorm';

@Entity({ name: 'admin' })
export class AdminEntity extends BasedEntity {
  @Column({
    name: 'admin_id',
  })
  @Generated('uuid')
  adminId: string;

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

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Exclude()
  @Column()
  password: string;
}
