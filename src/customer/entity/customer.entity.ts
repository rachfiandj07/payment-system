import { Customers } from "@prisma/client";

export class CustomersEntity implements Customers {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}