import { Processor, WorkerHost } from '@nestjs/bullmq';
import { $Enums } from '@prisma/client';
import { Job } from 'bullmq';
import { DatabaseService } from 'src/database/database.service';

@Processor('paymentcheck')
export class PaymentConsumer extends WorkerHost {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }
  async process(job: Job, token?: string): Promise<any> {
    try {
      await this.databaseService.payments.update({
        where: { id: job.data.savedPayment.id },
        data: { status: $Enums.PaymentStatus.EXPIRED },
      });

      console.info(
        `Payment ${job.data.savedPayment.id} updated to EXPIRED. Token ${token}`,
      );
    } catch (error) {
      console.error('Error processing job:', error);
      throw error;
    }
  }
}
