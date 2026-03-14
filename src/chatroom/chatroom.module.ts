import { Module } from '@nestjs/common'
import { PrismaServiceModule } from '../../prisma/prisma.module'
import { ChatRoomController } from './chatroom.controller'
import { ChatRoomService } from './chatroom.service'

@Module({
    imports: [PrismaServiceModule],
    controllers: [ChatRoomController],
    providers: [ChatRoomService],
})
export class ChatRoomModule {}