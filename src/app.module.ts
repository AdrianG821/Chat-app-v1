import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaServiceModule } from '../prisma/prisma.module';
import { PrismaClientExceptionFilter } from './common/prisma-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ChatRoomModule } from './chatroom/chatroom.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaServiceModule , UserModule , AuthModule, ChatModule, ChatRoomModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter
    }
  ],
})
export class AppModule {}
