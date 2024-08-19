import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    AdminModule, InvoiceModule, CustomerModule, AuthorizationModule, DatabaseModule, PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
