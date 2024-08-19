import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HashService } from 'src/utils/hash';

@Module({
  controllers: [AdminController],
  providers: [AdminService, HashService],
})
export class AdminModule {}
