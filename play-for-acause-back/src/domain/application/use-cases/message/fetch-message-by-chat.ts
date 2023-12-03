import { Either, right } from '@/core/entities/either';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
import { ChatMessagesRepository } from '../../repositories/chat-messages-repository';
import { Injectable } from '@nestjs/common';

interface FetchMessageByChatUseCaseRequest {
  chatId: string;
  page: number;
}
type FetchMessageByChatUseCaseResponse = Either<
  null,
  { chatMessages: ChatMessage[]; totalPages: number }
>;
@Injectable()
export class FetchMessageByChatUseCase {
  constructor(private chatMessagesRepository: ChatMessagesRepository) {}
  async execute({
    chatId,
    page
  }: FetchMessageByChatUseCaseRequest): Promise<FetchMessageByChatUseCaseResponse> {
    const chatMessages = await this.chatMessagesRepository.findManyByChatId(
      chatId,
      { page }
    );
    const totalPages =
      await this.chatMessagesRepository.getNumberOfPages(chatId);
    return right({
      chatMessages,
      totalPages
    });
  }
}
