import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentLinkDTO {
  @ApiProperty({
    example: 'u123789-12093840-iu78901',
    required: true,
  })
  invoices_id: string;
}
