import { PaginationParams } from '@/core/entities/pagination-params';
import { ChatMessagesRepository } from '@/domain/application/repositories/chat-messages-repository';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
export class InMemoryChatMessagesRepository implements ChatMessagesRepository {
  public items: ChatMessage[] = [];
  async create(chatMessage: ChatMessage) {
    this.items.push(chatMessage);
  }
  async findById(id: string) {
    const chatmessage = this.items.find((item) => item.id.toString() === id);
    if (!chatmessage) {
      return null;
    }
    return chatmessage;
  }
  async findManyByChatId(chatId: string, { page }: PaginationParams) {
    const chatMessages = this.items
      .filter((item) => item.chatId.toString() === chatId)
      .slice((page - 1) * 20, page * 20);
    return chatMessages;
  }
  async delete(chatMessage: ChatMessage) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === chatMessage.id
    );
    this.items.splice(itemIndex, 1);
  }
}
