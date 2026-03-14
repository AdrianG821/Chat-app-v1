import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service' 
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Users } from '@prisma/client'


@Injectable()

export class AuthService {

    constructor (
        private readonly users: UsersService,
        private readonly jwt: JwtService,
    ) {}

    private signToken(user: Pick<Users, 'id' | 'email' >) {
        const payload = { sub: user.id , email: user.email }
        return this.jwt.sign(payload , {
            secret: process.env.JWT_SECRET,
            expiresIn: Number(process.env.JWT_EXPIRES_IN || 7200),
        })

    }

    async register(dto: RegisterDto) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12)
        const passwordHash = await bcrypt.hash(dto.password , saltRounds)
        const user = await this.users.create({ name: dto.name , email: dto.email , passwordHash })
        const accessToken = this.signToken(user as any)
        return { user , accessToken}
    }


    async login ( dto: LoginDto ) {
        const found = await this.users.findByEmail(dto.email)
        if(!found) throw new UnauthorizedException('Emailul este gresit!')

        const ok = await bcrypt.compare(dto.password , found.passwordHash)
        if (!ok) throw new UnauthorizedException('Parola este gresita!')

        const user = {
            id: found.id ,
            name: found.name ,
            email: found.email , 
            createdAt: found.createdAt ,
            updatedAt: found.updatedAt ,
        }

        const accessToken = this.signToken(user as any)
        return { user , accessToken}
    }

    async me( userId: number ){
        const item = await this.users.findById(userId)

        return item
    }

}