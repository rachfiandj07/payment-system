import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class CreateInvoiceDTO {
  @ApiProperty({
    example: '2024-08-09',
    required: true,
  })
  invoice_date: string;

  @ApiProperty({
    example: '500000',
    required: true,
  })
  amount_due: string;

  @ApiProperty({
    example: 'u7819203-abc812',
    required: false,
  })
  customers_id?: string | undefined;

  @ApiProperty({
    example: '2024-08-20',
    required: true,
  })
  due_date: string;

  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  add_by: string;

  @ApiProperty({
    example: 'PAID" | "PENDING" | "PARTIALLY_PAID" | "ON_DUE_DATE',
    required: true,
  })
  invoice_status: $Enums.InvoiceStatus;

  customers?: CreateCustomer | undefined;
}

class CreateCustomer {
  @ApiProperty({
    example: 'naufal',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  email: string;
}
