import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const adminLogin = this.config.get('ADMIN_LOGIN') || 'admin';
    const adminPassword = this.config.get('ADMIN_PASSWORD') || 'wheels4rent';

    if (dto.login !== adminLogin || dto.password !== adminPassword) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const payload = { sub: 'admin', role: 'admin' };
    return { access_token: this.jwtService.sign(payload) };
  }
}
