import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(){}

    @Post('signup')
    signup(){
        return 'singup on'
    }

    @Post('signin')
    signin(){
        return 'signin on'
    }
}
