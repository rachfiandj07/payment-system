import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('CLIENT_CREDENTIALS'),
    });
  }

  public async validate(payload: any) {
    return {
      iat: payload.iat,
      exp: payload.exp,
      email: payload.email,
      id: payload.id,
      role: payload.role,
    };
  }

  private isTokenExpired(expirationTime: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return expirationTime < currentTimestamp;
  }
}
