import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository';
import { UsersRepository } from '@/domain/application/repositories/user-repository';
import { ChatsRepository } from '@/domain/application/repositories/chat-repository';
import { PrismaChatsRepository } from './prisma/repositories/prisma-chat-repository';
import { ChatUsersRepository } from '@/domain/application/repositories/chat-users-repository';
import { PrismaChatsUserRepository } from './prisma/repositories/prisma-chat-user-repository';
import { ChatMessagesRepository } from '@/domain/application/repositories/chat-messages-repository';
import { PrismaChatMessageRepository } from './prisma/repositories/prisma-chat-message-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository
    },
    {
      provide: ChatsRepository,
      useClass: PrismaChatsRepository
    },
    {
      provide: ChatUsersRepository,
      useClass: PrismaChatsUserRepository
    },
    {
      provide: ChatMessagesRepository,
      useClass: PrismaChatMessageRepository
    }
  ],
  exports: [
    PrismaService,
    UsersRepository,
    ChatsRepository,
    ChatUsersRepository,
    ChatMessagesRepository
  ]
})
export class DatabaseModule {}
