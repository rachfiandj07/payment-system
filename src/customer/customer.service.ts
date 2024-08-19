import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CustomersEntity } from './entity/customer.entity';

@Injectable()
export class CustomerService {
    constructor(private readonly databaseService: DatabaseService) {}

    public async create(createCustomerDTO: Prisma.CustomersCreateInput): Promise<Record<string, string> | boolean> {
        let email: string = createCustomerDTO.email
        try {
            const data = await this.databaseService.customers.findUnique({
                where: {
                    email,
                }
            })
            if (data) {
                return false
            }

            const customer: CustomersEntity = await this.databaseService.customers.create({ data: createCustomerDTO })
            return { id: customer.id, name: customer.name }
        } catch (error) {
            return error.message
        }
    }

    public async findByID(id: string): Promise<Record<string, string> | Boolean> {
        try {
            const data: any = await this.databaseService.customers.findUnique({
                where: {
                    id,
                }
            })
            if (!data) {
                return false
            }

            return { id: data.id, name: data.name }
        } catch (error) {
            return error.message
        }
    }

    public async findByEmail(email: string) {
        try {
            const data: any = await this.databaseService.customers.findUnique({
                where: {
                    email,
                }
            })
            if (data) {
                return {}
            }

            return { id: data.id, name: data.name }
        } catch (error) {
            return error.message
        }
    }
}
