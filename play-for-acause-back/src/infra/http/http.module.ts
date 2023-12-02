import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/user/authenticate-user';
import { RegisterUserUseCase } from '@/domain/application/use-cases/user/register-user';
import { AccountController } from './controllers/account.controller';
import { ChatController } from './controllers/chat.controller';
import { CreateChatUseCase } from '@/domain/application/use-cases/chat/create-chat';
import { MessageController } from './controllers/message.controller';
import { MessageOnChatUseCase } from '@/domain/application/use-cases/message/message-on-chat';
import { FetchMessageByChatUseCase } from '@/domain/application/use-cases/message/fetch-message-by-chat';
import { FetchRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-recent-chats';
import { FetchUserRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-user-recent-chats';
import { GetUserByEmailUseCase } from '@/domain/application/use-cases/user/get-users-by-email';
import { GetMessageByIdUseCase } from '@/domain/application/use-cases/message/get-message-by-id';
import { GetUserByIdUseCase } from '@/domain/application/use-cases/user/get-user-by-id';
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
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    CreateChatUseCase,
    FetchRecentChatsUseCase,
    MessageOnChatUseCase,
    FetchMessageByChatUseCase,
    FetchUserRecentChatsUseCase,
    GetMessageByIdUseCase
  ]
})
export class HttpModule {}
