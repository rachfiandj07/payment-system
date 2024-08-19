import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDTO {
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
}
