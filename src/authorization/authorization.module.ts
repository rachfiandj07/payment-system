import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/utils/hash';
import { AdminService } from 'src/admin/admin.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule, PassportStrategy } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('CLIENT_CREDENTIALS')
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, JwtService, PasswordService, AdminService, JwtStrategy],
})
export class AuthorizationModule {}
