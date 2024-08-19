import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';

export class CreateCustomer {
  @ApiProperty({
    example: 'naufal',
    required: true,
  })
  @IsNotEmpty({ message: 'Customer name is required' })
  name: string;

  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Customer email must be a valid email address' })
  @IsNotEmpty({ message: 'Customer email is required' })
  email: string;
}

export class CreateInvoiceDTO {
  @ApiProperty({
    example: '2024-08-09',
    required: true,
  })
  @IsDateString({}, { message: 'Invoice date must be a valid date string' })
  @IsNotEmpty({ message: 'Invoice date is required' })
  invoice_date: string;

  @ApiProperty({
    example: '500000',
    required: true,
  })
  @IsNotEmpty({ message: 'Amount due is required' })
  @IsString({ message: 'Amount due must be a string' })
  amount_due: string;

  @ApiProperty({
    example: 'u7819203-abc812',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Customer ID must be a string' })
  customers_id?: string;

  @ApiProperty({
    example: '2024-08-20',
    required: true,
  })
  @IsDateString({}, { message: 'Due date must be a valid date string' })
  @IsNotEmpty({ message: 'Due date is required' })
  due_date: string;

  @ApiProperty({
    example: 'naufal@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Add by must be a valid email address' })
  @IsNotEmpty({ message: 'Add by is required' })
  add_by: string;

  @ApiProperty({
    example: 'PAID | PENDING | PARTIALLY_PAID | ON_DUE_DATE',
    required: true,
  })
  @IsEnum(InvoiceStatus, { message: 'Invoice status must be a valid enum value' })
  @IsNotEmpty({ message: 'Invoice status is required' })
  invoice_status: InvoiceStatus;

  @IsOptional()
  customers?: CreateCustomer;
}

