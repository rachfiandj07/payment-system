import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDTO {
  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'naufal123',
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    example: 'FINANCE_MANAGER|ADMIN',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either FINANCE_MANAGER or ADMIN' })
  role?: Role;
}
