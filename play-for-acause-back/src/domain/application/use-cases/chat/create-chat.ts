import { Either, right } from '@/core/entities/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Chat } from '@/domain/enterprise/entities/chat';
import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../../repositories/chat-repository';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list';

interface CreateChatUseCaseRequest {
  name: string;
  usersIds: string[];
}
type CreateChatUseCaseResponse = Either<
  null,
  {
    chat: Chat;
  }
>;
@Injectable()
export class CreateChatUseCase {
  constructor(private chatRepository: ChatsRepository) {}
  async execute({
    name,
    usersIds
  }: CreateChatUseCaseRequest): Promise<CreateChatUseCaseResponse> {
    const chat = Chat.create({
      name
    });
    const chatUsers = usersIds.map((userId) => {
      return ChatUser.create({
        userId: new UniqueEntityID(userId),
        chatId: chat.id
      });
    });
    chat.users = new ChatUserList(chatUsers);
    console.log(chat.users.currentItems);
    await this.chatRepository.create(chat);
    return right({
      chat
    });
  }
}
