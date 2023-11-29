import { Chat } from '@/domain/enterprise/entities/chat';

export class ChatPresenter {
  static toHTTP(chat: Chat) {
    return {
      id: chat.id.toString(),
      title: chat.name,
      users: chat.users.listToString(),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  }
}
