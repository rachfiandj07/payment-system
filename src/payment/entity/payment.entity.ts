import { $Enums, Payments } from "@prisma/client";

export class PaymentEntity implements Payments {
    created_at: Date;
    expired_at: Date;
    id: string;
    invoices_id: string;
    payment_link: string;
    status: $Enums.PaymentStatus;
    updated_at: Date;
}