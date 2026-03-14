import { Injectable } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    async create(params: { name: string ; email: string; passwordHash: string}) {
        const { name, email, passwordHash  } = params;
        return this.prisma.users.create({
            data: { name: name, email, passwordHash },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        })
    }

    findByEmail(email: string){
        return this.prisma.users.findUnique({
            where: { email },
        })
    }

    findById(id: number) {
        return this.prisma.users.findUnique({
            where: { id } ,
            select: { id: true, name: true , createdAt: true , updatedAt: true }
        })
    }
    

}