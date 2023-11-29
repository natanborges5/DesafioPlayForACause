import { ChatUser } from '@/domain/enterprise/entities/chat-user';

export abstract class ChatUsersRepository {
  abstract create(chatUser: ChatUser): Promise<void>;
  abstract findManyByChatId(chatId: string): Promise<ChatUser[]>;
  abstract deleteManyByChatId(chatId: string): Promise<void>;
}
