import { Either, right } from '@/core/entities/either';
import { Chat } from '@/domain/enterprise/entities/chat';
import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../../repositories/chat-repository';
import { ChatUsersRepository } from '../../repositories/chat-users-repository';
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list';

interface FetchUserRecentChatsUseCaseRequest {
  page: number;
  userId: string;
}
type FetchUserRecentChatsUseCaseResponse = Either<null, { chats: Chat[] }>;
@Injectable()
export class FetchUserRecentChatsUseCase {
  constructor(
    private chatRepository: ChatsRepository,
    private chatUserRepository: ChatUsersRepository
  ) {}
  async execute({
    page,
    userId
  }: FetchUserRecentChatsUseCaseRequest): Promise<FetchUserRecentChatsUseCaseResponse> {
    const chats = await this.chatRepository.findManyRecentByUserId(
      { page },
      userId
    );
    const chatWithUsers = await Promise.all(
      chats.map(async (chat) => {
        const chatUsers = await this.chatUserRepository.findManyByChatId(
          chat.id.toString()
        );
        chat.users = new ChatUserList(chatUsers);
        return chat;
      })
    );
    return right({
      chats: chatWithUsers
    });
  }
}
