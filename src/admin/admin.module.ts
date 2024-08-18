import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PasswordService } from 'src/utils/hash';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PasswordService]
})
export class AdminModule {}
