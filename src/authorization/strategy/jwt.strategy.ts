import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private JwtService: JwtService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('CLIENT_CREDENTIALS')
    });
  }

  public async validate(payload: any) {
    return {
      iat: payload.iat,
      exp: payload.exp,
      email: payload.email,
      id: payload.id,
      is_enabled_restore: payload.is_enabled_restore,
      last_restore: payload.last_restore,
      device_id: payload.devide_id,
      is_deleted: payload.is_deleted,
    };
  }

  private verifyToken(token: string): boolean {
    try {
      this.JwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  private isTokenExpired(expirationTime: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return expirationTime < currentTimestamp;
  }
}
