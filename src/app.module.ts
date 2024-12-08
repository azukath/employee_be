import { Module } from '@nestjs/common';
import { DatabaseModule } from './libs/db/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { LeaveModule } from './modules/leave/leave.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
    LeaveModule,
    EmployeeModule,
    AuthModule,
    CacheModule.register(),
  ],
  exports: [
    DatabaseModule,
    AdminModule,
    LeaveModule,
    EmployeeModule,
    AuthModule,
    CacheModule,
  ],
})
export class AppModule {}
