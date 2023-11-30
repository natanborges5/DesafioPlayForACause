import { ChatMessage } from '@/domain/enterprise/entities/chat-message';

export class MessagePresenter {
  static toHTTP(message: ChatMessage) {
    return {
      id: message.id.toString(),
      authorId: message.authorId.toString(),
      chatId: message.chatId.toString(),
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }
}
