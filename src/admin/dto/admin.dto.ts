import { Role } from '@prisma/client';

export interface CreateAdminDTO {
  email: string;
  password: string;
  role?: Role;
}
