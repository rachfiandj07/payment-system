import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CustomerService } from 'src/customer/customer.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'invoicecheck',
    }),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, CustomerService],
})
export class InvoiceModule {}
