import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service'
import { BadRequestException } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    constructor(
      private readonly jwtService: JwtService,
      private readonly prisma: PrismaService
    ) {}

    async handleConnection(client: Socket) {

      try {
        const token = client.handshake.auth?.token
        
        if(!token) {
          console.log("Nu avem token")
          client.disconnect()
          return
        }
        const payload = await this.jwtService.verifyAsync(token)
        client.data.user = payload


      } catch(e: any) {
        console.log("Token invalid")
        client.disconnect()
      }
    }

    handleDisconnect(client: Socket) {
    }

    @SubscribeMessage("join_conversation")
    async handleJoinConversation(@MessageBody() body: {conversationId: number}, @ConnectedSocket() client: Socket){
      const userId = client.data.user?.sub

      if (!userId) {
        throw new WsException("Unauthorized");
      }
      const exists = await this.prisma.conversationParticipant.findFirst({
        where: { conversationId: Number(body.conversationId) , userId: userId},
        select: { id: true }
      })

      if(!exists){
        throw new WsException("You are not in this conversation")
      }

      await client.join(`conversation:${body.conversationId}`)

      return { ok: true }
    }


    @SubscribeMessage("message_send")
    async handleMessageRecived(@MessageBody() body: { message: string , conversationId: number } , @ConnectedSocket() client: Socket) {
      // console.log(client.id)
      // console.log(body)
      // console.log(client.data.user?.sub)
      const userId = client.data.user?.sub

      if(!userId) throw new WsException("Unauthorized")

      const saved = await this.prisma.message.create({
        data: { sendersId: client.data.user?.sub , conversationId: Number(body.conversationId) , content: body.message },
        select: { id: true , content: true, sendersId: true, conversationId: true }
      })
      console.log(saved)

      this.server.to(`conversation:${Number(body.conversationId)}`).emit("message_received", saved)

      // client.emit("message_received", {
      //   message: body.message
      // })


      return { ok: true , id: saved.id }
    }


}
