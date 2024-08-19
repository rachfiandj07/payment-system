import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDTO {
  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'naufal123',
    required: true,
  })
  password: string;

  @ApiProperty({ example: 'FINANCE_MANAGER|ADMIN' })
  role?: Role;
}
