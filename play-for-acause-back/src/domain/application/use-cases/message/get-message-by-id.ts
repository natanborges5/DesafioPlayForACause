import { Either, left, right } from '@/core/entities/either';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { ChatMessagesRepository } from '../../repositories/chat-messages-repository';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';

interface GetMessageByIdUseCaseRequest {
  id: string;
}
type GetMessageByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { message: ChatMessage }
>;
@Injectable()
export class GetMessageByIdUseCase {
  constructor(private messageRepository: ChatMessagesRepository) {}
  async execute({
    id
  }: GetMessageByIdUseCaseRequest): Promise<GetMessageByIdUseCaseResponse> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      return left(new ResourceNotFoundError());
    }
    return right({
      message
    });
  }
}
