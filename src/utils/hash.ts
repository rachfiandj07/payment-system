import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    private readonly saltRounds = 10;

    async hash(data: string): Promise<string> {
        return bcrypt.hash(data, this.saltRounds);
    }

    async compare(current_data: string, hashed_data: string): Promise<boolean> {
        return bcrypt.compare(current_data, hashed_data);
    }
}
