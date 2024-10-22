import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    async signup(dto: AuthDTO){
        try {
            const hash = await argon.hash(dto.password)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash
                }
            })
            return this.signToken(user.id, user.email)
        }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException('Credetials Taken', )
                }
            }
        }
        throw error
    }
    async signin(dto: AuthDTO){
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email }
        })
        if (!user) throw new ForbiddenException('Credetials Incorrect')
        const pwMatches = await argon.verify( user.password, dto.password)
        return this.signToken(user.id, user.email)
    }

    async signToken(userId: string, email:string): Promise<{access_token: string}>{
        const payload = {
            sub: userId,
            email,
        }
        const secret = this.config.get('JWT_SECRET')
    
        const token = await this.jwt.signAsync(payload,
            {
                expiresIn: '15m',
                secret:secret,
            }
        )
    
        return {
            access_token: token,
        }
        
      }
}
