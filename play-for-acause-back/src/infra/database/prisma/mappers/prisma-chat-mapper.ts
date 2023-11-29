import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Chat } from '@/domain/enterprise/entities/chat';
import { Chat as PrismaChat, Prisma } from '@prisma/client';

export class PrismaChatMapper {
  static toDomain(raw: PrismaChat): Chat {
    return Chat.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrisma(chat: Chat): Prisma.ChatUncheckedCreateInput {
    return {
      id: chat.id.toString(),
      name: chat.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  }
}
