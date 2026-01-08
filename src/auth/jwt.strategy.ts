import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
    console.log('--- 2. JwtStrategy: Decoded Payload ---');
    console.log('Role inside Token:', payload.role);

       const user = await this.usersService.findOne(payload.sub);
    if (!user) {
        throw new UnauthorizedException();
    }
    return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,                     
    };
    }

} 