import { Injectable } from '@nestjs/common'
import { Prisma} from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { NotFoundException, BadRequestException , InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async insertConversation(data: { id: number, message: string }, userId: number) {
        const exists = await this.prisma.conversationParticipant.groupBy({
            by: ['conversationId'],
            where: {  userId: {in: [ data.id , userId ]} },
            _count: {
                userId: true
            },
            having: {
                userId: {
                    _count: {
                        equals: 2
                    }
                }
            }
        })
        console.log(exists)
        if(exists.length !== 0) return  {id: exists[0].conversationId} 
        return await this.prisma.$transaction(async (tx) => {
            const conversation = await tx.conversation.create({
                data: {},
                select: { id: true }
            })
            const conversationParticipantRecipient = await tx.conversationParticipant.create({
                data: { conversationId: conversation.id, userId: data.id}
            })
            const conversationParticipantSender = await tx.conversationParticipant.create({
                data: { conversationId: conversation.id, userId: userId}
            })
            const message = await tx.message.create({
                data: { conversationId: conversation.id, sendersId: userId, content: data.message }
            })

            return conversation
          }  
        )
    }

    async fetchMessages(userId: number,id: number) {
        const apartine = await this.prisma.conversationParticipant.findFirst({
            where: { conversationId: id, userId: userId },
            select: { id: true }
        })
        
        if(!apartine) throw new BadRequestException("You are not in this conversation")

        const items = await this.prisma.message.findMany({
            where: { conversationId: id },
            select: { id: true, conversationId: true , sendersId: true , content: true }
        })

        const temp = items.map((prev) => prev.sendersId === userId ? {...prev, me: true} : {...prev, me: false})

        return temp
    }
}