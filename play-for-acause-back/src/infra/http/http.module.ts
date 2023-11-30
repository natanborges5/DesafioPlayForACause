import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/user/authenticate-user';
import { RegisterUserUseCase } from '@/domain/application/use-cases/user/register-user';
import { AccountController } from './controllers/account.controller';
import { ChatController } from './controllers/chat.controller';
import { CreateChatUseCase } from '@/domain/application/use-cases/chat/create-chat';
import { FetchRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-recent-chats';
import { MessageController } from './controllers/message.controller';
import { MessageOnChatUseCase } from '@/domain/application/use-cases/message/message-on-chat';
import { FetchMessageByChatUseCase } from '@/domain/application/use-cases/message/fetch-message-by-chat';
@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    AccountController,
    ChatController,
    MessageController
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    CreateChatUseCase,
    FetchRecentChatsUseCase,
    MessageOnChatUseCase,
    FetchMessageByChatUseCase
  ]
})
export class HttpModule {}
