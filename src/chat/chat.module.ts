import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { PrismaServiceModule } from "../../prisma/prisma.module";


@Module({
  imports: [
    PrismaServiceModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}