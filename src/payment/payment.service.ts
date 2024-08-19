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
    private async generatePaymentLink(user_id: string, amount: string, expiration_time: number, baseUrl: string, invoices_id: string): Promise<string> {
        try {
            const dataToHash = `${user_id}|${amount}|${expiration_time}|${invoices_id}`;
            const hash = await this.hashService.hashGenerateLink(dataToHash);
            const paymentLink = `${baseUrl}/payment/verify?user=${encodeURIComponent(user_id)}&amount=${amount}&expires=${expiration_time}&invoices_id=${invoices_id}&signature=${encodeURIComponent(hash)}`;
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
            const linkPromise = this.generatePaymentLink(data.customers_id, data.amount_due, expirationTime, base_url, data.id);
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

    public async payment(user_id: string, amount: string, expires: string, invoices_id: string, signature: string): Promise<any> {
        try {
            const expiresTimestamp = parseInt(expires, 10);
            const dataToHash = `${user_id}|${amount}|${expiresTimestamp}|${invoices_id}`;
            const expectedHash = await this.hashService.hashGenerateLink(dataToHash);
            const isSignatureValid = expectedHash === signature;
            const isNotExpired = Date.now() <= expiresTimestamp;
            if (isSignatureValid && isNotExpired) {                
                const invoices = await this.databaseService.invoices.findMany({
                    where: {
                      payments: {
                        some: {
                          invoices_id: invoices_id,
                        },
                      },
                    },
                    select: {
                      id: true,
                      invoice_status: true,
                      amount_due: true,
                    },
                  });

                await Promise.all([
                    this.databaseService.payments.updateMany({
                        where: { invoices_id: invoices_id as string },
                        data: {
                            status: $Enums.PaymentStatus.SUCCESS
                        }
                    }),
                    this.databaseService.invoices.update({
                        where: { id: invoices[0].id },
                        data: {
                            invoice_status: $Enums.InvoiceStatus.PAID
                        }
                    })
                ])

                return {
                    statusCode: HttpStatus.OK,
                    message: `Payment of $${invoices[0].amount_due} for Invoice ${invoices_id} completed successfully`,
                    data: {}
                }
            } else if (isSignatureValid && !isNotExpired) {
                return {
                    statusCode: HttpStatus.OK,
                    message: 'Payment link has expired, no payment can be made',
                    data: {}
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Failed to verify',
                    data: {}
                }
            }

          } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }
}