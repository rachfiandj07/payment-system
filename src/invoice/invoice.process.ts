import { Processor, WorkerHost } from '@nestjs/bullmq';
import { $Enums } from '@prisma/client';
import { Job } from 'bullmq';
import { DatabaseService } from 'src/database/database.service';

@Processor('invoicecheck')
export class InvoiceConsumer extends WorkerHost{
    constructor(private readonly databaseService: DatabaseService) {
        super();
    }
    async process(job: Job, token?: string): Promise<any> {
        try {
            await this.databaseService.invoices.update({
              where: { id: job.data.invoiceData.invoice_id },
              data: { invoice_status: $Enums.InvoiceStatus.ON_DUE_DATE },
            });
      
            console.info(`Invoices ${job.data.invoiceData.invoice_id} updated to ON DUE DATE.`);
          } catch (error) {
            console.error('Error processing job:', error);
            throw error;
          }
    }
}