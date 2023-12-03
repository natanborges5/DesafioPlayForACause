import { PaginationParams } from '@/core/entities/pagination-params';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';

export abstract class ChatMessagesRepository {
  abstract create(chatMessage: ChatMessage): Promise<void>;
  abstract findById(id: string): Promise<ChatMessage | null>;
  abstract findManyByChatId(
    chatId: string,
    params: PaginationParams
  ): Promise<ChatMessage[]>;
  abstract delete(chatMessage: ChatMessage): Promise<void>;
  abstract getNumberOfPages(chatId: string): Promise<number>;
}
