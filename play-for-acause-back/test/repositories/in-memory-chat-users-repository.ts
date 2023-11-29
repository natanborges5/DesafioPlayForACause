import { ChatUsersRepository } from '@/domain/application/repositories/chat-users-repository';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';

export class InMemoryChatUsersRepository implements ChatUsersRepository {
  async create(chatUser: ChatUser): Promise<void> {
    this.items.push(chatUser);
  }

  async deleteManyByChatId(chatId: string) {
    const chatUsers = this.items.filter(
      (item) => item.chatId.toString() !== chatId
    );
    this.items = chatUsers;
  }
  public items: ChatUser[] = [];
  async findManyByChatId(chatId: string) {
    const chatUsers = this.items.filter(
      (item) => item.chatId.toString() === chatId
    );
    return chatUsers;
  }
}
