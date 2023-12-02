import { Either, left, right } from '@/core/entities/either';
import { ChatsRepository } from '../../repositories/chat-repository';
import { NotAllowedError } from '../errors/not-allowed-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChatUsersRepository } from '../../repositories/chat-users-repository';
import { Chat } from '@/domain/enterprise/entities/chat';

interface EditChatUseCaseRequest {
  chatId: string;
  name: string;
  usersIds: string[];
  lastMessage: string;
}
type EditChatUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { chat: Chat }
>;
@Injectable()
export class EditChatUseCase {
  constructor(
    private chatRepository: ChatsRepository,
    private userRepository: UsersRepository,
    private chatUserRepository: ChatUsersRepository
  ) {}
  async execute({
    chatId,
    name,
    usersIds,
    lastMessage
  }: EditChatUseCaseRequest): Promise<EditChatUseCaseResponse> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      return left(new ResourceNotFoundError());
    }

    const currentChatUsers =
      await this.chatUserRepository.findManyByChatId(chatId);
    const chatUserList = new ChatUserList(currentChatUsers);
    const chatUsers: ChatUser[] = [];
    let userDontExists = false;
    for (const userId of usersIds) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        userDontExists = true;
      }
      const newUser = ChatUser.create({
        userId: new UniqueEntityID(userId),
        chatId: chat.id
      });
      chatUsers.push(newUser);
    }
    if (userDontExists) return left(new ResourceNotFoundError());
    chatUserList.update(chatUsers);
    chat.name = name;
    chat.users = chatUserList;
    chat.lastMessageId = new UniqueEntityID(lastMessage);
    await this.chatRepository.save(chat);
    return right({ chat });
  }
}
