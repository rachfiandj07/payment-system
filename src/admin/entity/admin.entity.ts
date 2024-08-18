import { $Enums, Admin } from "@prisma/client";

class AdminEntity implements Admin {
    id: string
    email: string
    password: string
    role: $Enums.Role;
    created_at: Date
    updated_at: Date
}
