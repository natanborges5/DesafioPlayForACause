import { Either, left, right } from '@/core/entities/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Chat } from '@/domain/enterprise/entities/chat';
import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../../repositories/chat-repository';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list';
import { UsersRepository } from '../../repositories/user-repository';
import { UserNotFoundError } from '../errors/usert-not-found-error';

interface CreateChatUseCaseRequest {
  name: string;
  usersIds: string[];
}

type CreateChatUseCaseResponse = Either<UserNotFoundError, { chat: Chat }>;

@Injectable()
export class CreateChatUseCase {
  constructor(
    private chatRepository: ChatsRepository,
    private userRepository: UsersRepository
  ) {}

  async execute({
    name,
    usersIds
  }: CreateChatUseCaseRequest): Promise<CreateChatUseCaseResponse> {
    const chat = Chat.create({ name });
    const chatUsers: ChatUser[] = [];
    let userDoesntExists = false;
    for (const userId of usersIds) {
      const user = await this.userRepository.findById(userId);

      if (user) {
        chatUsers.push(
          ChatUser.create({
            userId: new UniqueEntityID(userId),
            chatId: chat.id
          })
        );
      } else {
        userDoesntExists = true;
      }
    }

    if (userDoesntExists) {
      return left(new UserNotFoundError());
    }

    chat.users = new ChatUserList(chatUsers);

    try {
      await this.chatRepository.create(chat);
      return right({ chat });
    } catch (error) {
      return left(new UserNotFoundError());
    }
  }
}
