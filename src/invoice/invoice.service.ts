import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { DatabaseService } from 'src/database/database.service';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreateInvoiceDTO } from './dto/invoice.dto';
import { $Enums } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectQueue('invoicecheck') private invoiceQueue: Queue,
        private readonly databaseService: DatabaseService, 
        private readonly customerService: CustomerService
    ) {}

    public async findByID(id: string): Promise<Record<string, string> | Boolean> {
        try {
            const data: any = await this.databaseService.invoices.findUnique({
                where: {
                    id
                }
            })

            if (!data) return false

            return data
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }

    public async create(context: ContextPayload, createInvoiceDTO: CreateInvoiceDTO) {
        try {
            if (createInvoiceDTO.customers_id !== undefined) {
                const data: any = await this.customerService.findByID(createInvoiceDTO.customers_id)
    
                if (!data) {
                    return {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Customer not found',
                        data: {}
                    }
                }
                const invoiceDate = this.transformDate(createInvoiceDTO.invoice_date)
                const due_date = this.transformDate(createInvoiceDTO.due_date)
                const expirationTime: number = due_date.getTime()

                if (expirationTime < Date.now()) {
                 return {
                     statusCode: HttpStatus.BAD_REQUEST,
                     message: 'Due date cant be less than this time',
                     data: {}
                 }
                }
 
                const delay: number = expirationTime - Date.now()
                const invoiceId: string = await this.generateInvoiceID(data.id)
 
                 const invoice = {
                     invoice_date: invoiceDate,
                     invoice_id: invoiceId,
                     amount_due: createInvoiceDTO.amount_due,
                     due_date: due_date,
                     add_by: context.user.email,
                     invoice_status: createInvoiceDTO.invoice_status,
                     customers_id: data.id
                 }
                 const invoiceData = await this.databaseService.invoices.create({ data: invoice})

                 await this.invoiceQueue.add(
                    'expiration-invoice-check', 
                    {
                        invoiceData
                    },
                    { 
                        delay,
                        attempts: 5,
                        backoff: 5000,
                        priority: 1
                    }
                )
                return {
                    statusCode: HttpStatus.CREATED,
                    message: 'Invoices created',
                    data: invoiceData
                }
            } else if (createInvoiceDTO.customers !== undefined) {
                const data: any = await this.customerService.create(createInvoiceDTO.customers)
                /*
                        invoice_date: Date;
                        amount_due: string;
                        customers_id?: string
                        due_date: Date;
                        add_by: string;
                        invoice_status: $Enums.InvoiceStatus;
                        customers?: CreateCustomer
                */
               const invoiceDate = this.transformDate(createInvoiceDTO.invoice_date)
               const due_date = this.transformDate(createInvoiceDTO.due_date)
               const expirationTime: number = due_date.getTime()

               if (expirationTime < Date.now()) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Due date cant be less than this time',
                    data: {}
                }
               }

               const delay: number = expirationTime - Date.now()
               const invoiceId: string = await this.generateInvoiceID(data.id)

                const invoice = {
                    invoice_date: invoiceDate,
                    invoice_id: invoiceId,
                    amount_due: createInvoiceDTO.amount_due,
                    due_date: due_date,
                    add_by: context.user.email,
                    invoice_status: createInvoiceDTO.invoice_status,
                    customers_id: data.id
                }

                const invoiceData = await this.databaseService.invoices.create({ data: invoice})
                await this.invoiceQueue.add(
                    'expiration-invoice-check', 
                    {
                        invoiceData
                    },
                    { 
                        delay,
                        attempts: 5,
                        backoff: 5000,
                        priority: 1
                    }
                )
                return {
                    statusCode: HttpStatus.CREATED,
                    message: 'Invoices created',
                    data: invoiceData
                }
            } else if (createInvoiceDTO.customers_id === undefined && createInvoiceDTO.customers_id === undefined) {
                return {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Customer information is required.',
                        data: {}
                }
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }

    private transformDate(inputDate: string): Date {
        const date = new Date(inputDate);
        const now = new Date();
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      
        return date;
      }

    private generateInvoiceID(customer_id: string): string {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        const invoiceId = `INV${customer_id}${year}${month}${day}${hours}${minutes}${seconds}`.toUpperCase().replace(/-/g, '');
      
        return invoiceId;
    }

    public async getInvoice(    
        query: {
        search?: string;
        status?: $Enums.InvoiceStatus;
      }) {
        const { search, status } = query;
    
        const where: any = {};
    
        if (search) {
          where.OR = [
            { invoice_id: { contains: search, mode: 'insensitive' } },
            { customers: { name: { contains: search, mode: 'insensitive' } } }
          ];
        }
    
        if (status) {
          where.invoice_status = status;
        }

        const data = await this.databaseService.invoices.findMany({
            where: Object.keys(where).length ? where : undefined,
            include: { customers: true },
        });
        
        return {
            statusCode: HttpStatus.FOUND,
            message: '',
            data: data
        }
    }
}
