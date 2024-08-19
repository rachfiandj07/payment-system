import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HashService } from 'src/utils/hash';
import { InvoiceService } from 'src/invoice/invoice.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, HashService, InvoiceService, CustomerService]
})
export class PaymentModule {}
