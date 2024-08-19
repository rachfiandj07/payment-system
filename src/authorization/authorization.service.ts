import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/utils/hash';
import { LoginAdminDTO } from './dto/authorization.dto';
import { AdminService } from 'src/admin/admin.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly adminService: AdminService,
        private readonly configService: ConfigService
    ) {}

    public async loginAsAdmin(loginAdminDTO: LoginAdminDTO): Promise<any | HttpException> {
        try {
            const data: any = await this.adminService.findByEmail(loginAdminDTO.email)

            if (!data) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Admin doesnt exists',
                    data: {},
                };
            }
    
            const comparePasswords = await this.hashService.compare(loginAdminDTO.password, data.password)
    
            if (!comparePasswords) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Missmatch credentials',
                    data: {},
                };
            }

            const token = await this.generateToken(data.email, data.id, data.role)
    
            return {
                statusCode: HttpStatus.OK,
                message: '',
                data: {
                  email: data.email,
                  token: token,
                  id: data.id,
                  role: data.role
                },
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        }
    }

    private async generateToken(email: string, id: string, role: string) {
        const teamId: string = 'ARATRXM6V';
        const audience: string = 'ara-research';
        const subject: string = 'ara.research.app'
    
        try {
          const privateKey = await this.configService.get('CLIENT_CREDENTIALS')
    
          const currentTime = Math.floor(Date.now() / 1000);
          const expirationTime = currentTime + 15777000; // 6 months
    
          const payload = {
            iss: teamId,
            iat: currentTime,
            exp: expirationTime,
            aud: audience,
            sub: subject,
            email: email,
            id: id,
            role: role
          };
    
          const token: any = this.jwtService.sign(payload, {
            privateKey: privateKey,
          });
    
          return token;
        } catch (error) {
          throw error.message
        }
    }
}
