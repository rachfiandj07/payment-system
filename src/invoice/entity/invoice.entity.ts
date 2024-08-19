import { $Enums, Invoices } from '@prisma/client';

export class InvoiceEntity implements Invoices {
  id: string;
  invoice_date: Date;
  invoice_id: string;
  amount_due: string;
  customers_id: string;
  due_date: Date;
  add_by: string;
  invoice_status: $Enums.InvoiceStatus;
  created_at: Date;
  updated_at: Date;
}
