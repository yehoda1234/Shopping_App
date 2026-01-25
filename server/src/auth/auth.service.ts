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


    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // פונקציה ליצירת טוקן (משותפת גם לרגיל וגם לגוגל)
  async login(user: any) {
    console.log('--- Login Attempt ---');
    console.log('User ID:', user.id);
    console.log('User Role:', user.role);

    const payload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateOAuthLogin(email: string, provider: string, profile: any) {
    const user = await this.usersService.findOrCreateOAuthUser(email, provider, profile);
    
   
    return this.login(user);
  }
}