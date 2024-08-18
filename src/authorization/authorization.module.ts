import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/utils/hash';
import { AdminService } from 'src/admin/admin.service';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, JwtService, PasswordService, AdminService]
})
export class AuthorizationModule {}
