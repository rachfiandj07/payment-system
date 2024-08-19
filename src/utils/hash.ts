import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class HashService {
    private readonly saltRounds = 10;

    async hash(data: string): Promise<string> {
        return bcrypt.hash(data, this.saltRounds);
    }

    async hashGenerateLink(data: string): Promise<string> {
        return createHash('sha256').update(data).digest('hex');
    }

    async compareGenerateLink(data: string, hash: string): Promise<boolean> {
        const computedHash = await this.hashGenerateLink(data);
        return computedHash === hash ? true : false;
    }

    async compare(current_data: string, hashed_data: string): Promise<boolean> {
        return bcrypt.compare(current_data, hashed_data);
    }
}
