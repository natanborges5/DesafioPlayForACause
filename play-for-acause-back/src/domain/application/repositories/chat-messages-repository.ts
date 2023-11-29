import { ChatMessage } from '@/domain/enterprise/entities/chat-message';

export abstract class ChatMessagesRepository {
    abstract findManyByChatId(
        chatId: string,
    ): Promise<ChatMessage[]>
    abstract deleteManyByChatId(chatId: string): Promise<void>
}
