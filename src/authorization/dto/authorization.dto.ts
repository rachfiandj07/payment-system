import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDTO {
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
  password: string;
}