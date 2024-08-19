import { $Enums } from '@prisma/client';

export interface CreateInvoiceDTO {
  invoice_date: string;
  amount_due: string;
  customers_id?: string | undefined;
  due_date: string;
  add_by: string;
  invoice_status: $Enums.InvoiceStatus;
  customers?: CreateCustomer | undefined;
}

interface CreateCustomer {
  name: string;
  email: string;
}
