import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/customer.service';
import { DatabaseService } from 'src/database/database.service';
import { ContextPayload } from 'src/utils/dto/utils.dto';
import { CreateInvoiceDTO } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
    constructor(private readonly databaseService: DatabaseService, private readonly customerService: CustomerService) {}

    public async create(context: ContextPayload, createInvoiceDTO: CreateInvoiceDTO) {
        console.log(createInvoiceDTO)
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

        // Set current time (hours, minutes, seconds, milliseconds) if needed
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
    
        const invoiceId = `INV-${customer_id}-${year}${month}${day}${hours}${minutes}${seconds}`;
      
        return invoiceId;
    } 
}
