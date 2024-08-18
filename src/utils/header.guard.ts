import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class HeaderGuard implements CanActivate {  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const expectedHeader = ['ara-client-app'];
      const actualHeader = request.headers['platform'];
  
      // Extract the IP address
      const forwardedIps = request.headers['x-forwarded-for'] as string;
      let ipAddress: string;
  
      if (forwardedIps) {
        ipAddress = forwardedIps.split(',')[0];
      } else {
        ipAddress =
          request.connection.remoteAddress || request.socket.remoteAddress;
      }
  
      if (!expectedHeader.includes(actualHeader)) {
        throw new UnauthorizedException('Invalid resource');
      }

      return true
    }
  }
  