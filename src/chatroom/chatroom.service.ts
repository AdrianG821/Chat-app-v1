import { Injectable } from '@nestjs/common'
import { Prisma} from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { NotFoundException, BadRequestException , InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class ChatRoomService {
    constructor (private readonly prisma: PrismaService) {}

    async getConversations(id: number) {
        const items = await this.prisma.conversationParticipant.findMany({
            where: { userId: id },
            select: { conversationId: true }
        })

        if(items.length === 0) throw new NotFoundException("No conversation found")
        
        const list = Array.from(items.map(w => w.conversationId))

        const conversations = await this.prisma.conversation.findMany({
            where: { id: { in: list } },
            select: { id: true , participants: {where: { userId: { not: id } } , select: { user: {select: { name: true }} } }, messages: { orderBy: { createdAt: 'desc' } , take: 1 , select: { content: true } }}
        })
        console.log(conversations)
        return conversations
    }
    

    async getAllUsers(id: number) {
        const items = await this.prisma.users.findMany({
            where: {id: { not: id } },
            select: { id: true , name:true }
        })

        if(items.length === 0) throw new NotFoundException("No users found")
    
        return items
    }

    async getOneUser(id: number, userS: string) {
        const items = await this.prisma.users.findMany({
            where: { name: userS },
            select: { id: true, name: true }
        })

        return items
    }

}