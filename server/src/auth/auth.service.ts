import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

    async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

    async login(user: any) {
   console.log('--- 1. Login Attempt ---');
    console.log('User ID:', user.id);
    console.log('User Role from DB:', user.role);
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
        access_token: this.jwtService.sign(payload),

        user: { 
        id: user.id,
        email: user.email,
        role: user.role 
    }
    };
  }


}
