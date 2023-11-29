import { Either, right } from '@/core/entities/either';
import { Chat } from '@/domain/enterprise/entities/chat';
import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../../repositories/chat-repository';

interface FetchRecentChatsUseCaseRequest {
  page: number;
}
type FetchRecentChatsUseCaseResponse = Either<null, { chats: Chat[] }>;
@Injectable()
export class FetchRecentChatsUseCase {
  constructor(private chatRepository: ChatsRepository) {}
  async execute({
    page
  }: FetchRecentChatsUseCaseRequest): Promise<FetchRecentChatsUseCaseResponse> {
    const chats = await this.chatRepository.findManyRecent({ page });
    return right({
      chats
    });
  }
}
