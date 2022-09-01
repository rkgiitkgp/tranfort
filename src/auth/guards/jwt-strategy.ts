import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) token = req.cookies['access-token'];
  console.log('cookies check', JSON.stringify(req.cookies));
  if (token) {
    return token;
  } else {
    token = req.headers?.authorization?.split(' ');
    if (token && token.length) return token[1];
  }
  return;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { ...payload.user };
  }
}
