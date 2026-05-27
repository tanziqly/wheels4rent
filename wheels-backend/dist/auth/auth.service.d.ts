import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private jwtService;
    private config;
    constructor(jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
