import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InvoiceService } from 'src/invoice/invoice.service';
import { HashService } from 'src/utils/hash';
import { CreatePaymentLinkDTO } from './dto/payment.dto';
import { ConfigService } from '@nestjs/config';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { PaymentEntity } from './entity/payment.entity';
import { $Enums } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly hashService: HashService,
        private readonly invoiceService: InvoiceService,
        private readonly configService: ConfigService
    ) {}
    private async generatePaymentLink(user_id: string, amount: string, expiration_time: number, baseUrl: string): Promise<string> {
        try {
            const dataToHash = `${user_id}|${amount}|${expiration_time}`;
            const hash = await this.hashService.hash(dataToHash);
            const paymentLink = `${baseUrl}/payment/verify?user=${encodeURIComponent(user_id)}&amount=${amount}&expires=${expiration_time}&signature=${encodeURIComponent(hash)}`;
            return paymentLink
        } catch (error) {
            return error.message
        }
    }
    public async generate(createPaymentLinkDTO: CreatePaymentLinkDTO, context: ContextPayload) {
        try {
            const data: any = await this.invoiceService.findByID(createPaymentLinkDTO.invoices_id)
            if (!data) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Invoice not found',
                    data: {}
                }
            }

            const base_url = context.baseUrl + '/' + this.configService.getOrThrow('PAYMENT_PREFIX')
            const expirationTime = Date.now() + 60 * 60 * 1000;
            const linkPromise = this.generatePaymentLink(data.customers_id, data.amount_due, expirationTime, base_url);
            const paymentData = {
              status: $Enums.PaymentStatus.WAITING,
              payment_link: '', 
              invoices_id: data.id as string,
              expired_at: new Date(expirationTime)
            };
        
            const [link, payments] = await Promise.all([
              linkPromise,
              this.databaseService.payments.create({ data: paymentData })
            ]);
        
            paymentData.payment_link = link;
        
            const savedPayment = await this.databaseService.payments.update({
              where: { id: payments.id as string },
              data: paymentData
            });

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Payment link created',
                data: savedPayment
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }
    // public async verifyPaymentLink(user_id: string, amount: string, expires: string, signature: string): Promise<boolean> {
    //     const dataToVerify = `${user_id}|${amount}|${expires}`;
    //     const hashToVerify = await this.hashService.hash(dataToVerify);
    //     // Check if the provided signature matches the hash of the data
    //     if (await this.hashService.compare(dataToVerify, signature) && Date.now() <= parseInt(expires)) {
    //       return true;
    //     }
    //     return false;
    //   }
}