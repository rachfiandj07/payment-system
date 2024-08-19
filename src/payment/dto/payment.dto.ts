import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentLinkDTO {
  @ApiProperty({
    example: 'u123789-12093840-iu78901',
    required: true,
  })
  @IsNotEmpty({ message: 'Invoice ID is required' })
  @IsString({ message: 'Invoice ID must be a string' })
  invoices_id: string;
}
