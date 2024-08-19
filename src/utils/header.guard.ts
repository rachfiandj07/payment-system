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

    if (!expectedHeader.includes(actualHeader)) {
      throw new UnauthorizedException('Invalid resource');
    }

    return true;
  }
}
