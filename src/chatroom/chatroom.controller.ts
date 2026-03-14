import {
  Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, ConflictException ,
  Param, ParseIntPipe, Body, Post, Query, Req, UseGuards,
  Patch
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChatRoomService } from './chatroom.service'


@Controller('chatroom')
@UseGuards(AuthGuard('jwt'))
export class ChatRoomController {
    constructor(private readonly chatroom: ChatRoomService) {}
    
    @Get('conversations')
    async getConversations(@Req() req: any) {
        const userId = req.user.userId as number

        const items = await this.chatroom.getConversations(userId)

        return items
    }

    @Get('get/all/users')
    async getUsers(@Req() req: any) {
        const userId = req.user.userId as number

        const items = await this.chatroom.getAllUsers(userId)

        return items
    }
    
    @Get('get/one/user')
    async getOneUsers(@Req() req: any,  @Query('userS') userS: string) {
        const userId = req.user.userId as number

        const items = await this.chatroom.getOneUser(userId, userS)

        return items
    }
}