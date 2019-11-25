import { Controller, Post, Body } from '@nestjs/common';

import { SocialLoginModel, RegistrationModel, LoginModel } from './../models';
import { User } from '../entities';
import { AuthService } from '../services';

@Controller('users')
export class UsersController {
    constructor(
        private readonly authService: AuthService,
        ) {}

    @Post('login')
    async login(@Body() model: LoginModel): Promise<User | { status: number }> {
        return this.authService.login(model);
    }

    @Post('register')
    async register(@Body() user: RegistrationModel): Promise<User> {
        return this.authService.register(user);
    }

    @Post('socialLogin')
    async customCreate(@Body() model: SocialLoginModel): Promise<User | { status: number }> {
        return this.authService.socialLogin(model);
    }
}
