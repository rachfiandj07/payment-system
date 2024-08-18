import { $Enums, Admin } from "@prisma/client";

export class AdminEntity implements Admin {
    id: string
    email: string
    password: string
    role: $Enums.Role;
    created_at: Date
    updated_at: Date
}
