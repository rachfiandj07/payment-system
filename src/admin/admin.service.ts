import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { PasswordService } from 'src/utils/hash';
import { AdminEntity } from './entity/admin.entity';

@Injectable()
export class AdminService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly passwordService: PasswordService
    ) {}

    public async create(createAdminDTO: Prisma.AdminCreateInput): Promise<any | HttpException> {
        try {
            const data = await this.findByEmail(createAdminDTO.email)
            if (data) {
                return {
                    statusCode: HttpStatus.FOUND,
                    message: 'Admin already exists',
                    data: {},
                };
            }

            const hashedPassword = await this.passwordService.hashPassword(createAdminDTO.password);
            const admin = {
                email: createAdminDTO.email,
                password: hashedPassword
            }

            await this.databaseService.admin.create({ data: admin })
            return {
                statusCode: HttpStatus.CREATED,
                message: 'Admin created',
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }

    public async findByEmail(email: string): Promise<AdminEntity | boolean> {
        try {
            const data: any = this.databaseService.admin.findUnique({
                where: {
                    email,
                }
            })

            if(!data) {
                return false
            }

            return data
        } catch (error) {
            throw error.message
        }
    }
}
