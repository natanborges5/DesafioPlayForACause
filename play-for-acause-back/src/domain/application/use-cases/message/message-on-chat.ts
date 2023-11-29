import { Either, left, right } from '@/core/entities/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
import { ChatMessagesRepository } from '../../repositories/chat-messages-repository';
import { ChatsRepository } from '../../repositories/chat-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface MessageOnChatUseCaseRequest {
  authorId: string;
  chatId: string;
  content: string;
}
type MessageOnChatUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    chatMessage: ChatMessage;
  }
>;
export class MessageOnChatUseCase {
  constructor(
    private chatRepository: ChatsRepository,
    private chatMessagesRepository: ChatMessagesRepository
  ) {}
  async execute({
    authorId,
    chatId,
    content
  }: MessageOnChatUseCaseRequest): Promise<MessageOnChatUseCaseResponse> {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      return left(new ResourceNotFoundError());
    }
    const chatMessage = ChatMessage.create({
      authorId: new UniqueEntityID(authorId),
      chatId: new UniqueEntityID(chatId),
      content
    });
    await this.chatMessagesRepository.create(chatMessage);
    return right({
      chatMessage
    });
  }
}
