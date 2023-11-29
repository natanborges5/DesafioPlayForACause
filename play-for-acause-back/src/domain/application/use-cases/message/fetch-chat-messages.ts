import { Either, right } from '@/core/entities/either';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
import { ChatMessagesRepository } from '../../repositories/chat-messages-repository';

interface FetchChatMessagesUseCaseRequest {
  chatId: string;
  page: number;
}
type FetchChatMessagesUseCaseResponse = Either<
  null,
  { chatMessages: ChatMessage[] }
>;
export class FetchChatMessagesUseCase {
  constructor(private chatMessagesRepository: ChatMessagesRepository) {}
  async execute({
    chatId,
    page
  }: FetchChatMessagesUseCaseRequest): Promise<FetchChatMessagesUseCaseResponse> {
    const chatMessages = await this.chatMessagesRepository.findManyByChatId(
      chatId,
      { page }
    );
    return right({
      chatMessages
    });
  }
}
