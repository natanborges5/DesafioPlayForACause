import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
import { Message as PrismaChatMessage, Prisma } from '@prisma/client';

export class PrismaChatMessageMapper {
  static toDomain(raw: PrismaChatMessage): ChatMessage {
    return ChatMessage.create(
      {
        chatId: new UniqueEntityID(raw.chatId),
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrisma(
    chatMessage: ChatMessage
  ): Prisma.MessageUncheckedCreateInput {
    return {
      id: chatMessage.id.toString(),
      chatId: chatMessage.chatId.toString(),
      authorId: chatMessage.authorId.toString(),
      content: chatMessage.content,
      createdAt: chatMessage.createdAt,
      updatedAt: chatMessage.updatedAt
    };
  }
}
