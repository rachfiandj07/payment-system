import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';
import { AuthorizationModule } from './authorization/authorization.module';

@Module({
  imports: [AdminModule, InvoiceModule, CustomerModule, AuthorizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
