import { PaginationParams } from '@/core/entities/pagination-params';
import { ChatsRepository } from '@/domain/application/repositories/chat-repository';
import { Chat } from '@/domain/enterprise/entities/chat';

export class InMemoryChatsRepository implements ChatsRepository {
  constructor() {}
  async findManyRecent({ page }: PaginationParams) {
    const chats = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
    return chats;
  }

  public items: Chat[] = [];
  async findById(id: string) {
    const chat = this.items.find((item) => item.id.toString() === id);
    if (!chat) {
      return null;
    }
    return chat;
  }
  async create(chat: Chat) {
    this.items.push(chat);
  }
  async save(chat: Chat) {
    const itemIndex = this.items.findIndex((item) => item.id === chat.id);
    this.items[itemIndex] = chat;
  }
  async delete(chat: Chat) {
    const itemIndex = this.items.findIndex((item) => item.id === chat.id);
    this.items.splice(itemIndex, 1);
  }
}
