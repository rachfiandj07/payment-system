import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HashService } from 'src/utils/hash';
import { InvoiceService } from 'src/invoice/invoice.service';
import { CustomerService } from 'src/customer/customer.service';
import { BullModule } from '@nestjs/bullmq';
import { PaymentConsumer } from './payment.process';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'paymentcheck'
    }),
    BullModule.registerQueue({
      name: 'invoicecheck'
    })
  ],
  controllers: [PaymentController],
  providers: [PaymentService, HashService, InvoiceService, CustomerService, PaymentConsumer]
})
export class PaymentModule {}
