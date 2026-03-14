import {
  Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, ConflictException ,
  Param, ParseIntPipe, Body, Post, Query, Req, UseGuards,
  Patch
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChatService } from './chat.service'


@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chat: ChatService) {}
  
  @Post('first/message')
  async getUsers(@Req() req: any, @Body() data: { id: number, message: string }) {
    const userId = req.user.userId as number

    const items = await this.chat.insertConversation(data, userId)
    console.log(items)
    return items
  }

  @Get('get/messages/:id')
  async fetchMessages(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId as number

    const items = await this.chat.fetchMessages(userId,id)

    return items
  }
}