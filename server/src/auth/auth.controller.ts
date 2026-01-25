import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guardsgoogl/google-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.authService.login(user);
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Request() req) {

    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req, @Res() res: Response) {

        const data = await this.authService.validateOAuthLogin(req.user.email, 'google', req.user);

        res.redirect(`http://localhost:5173/auth/callback?token=${data.access_token}`);
    }
        
}