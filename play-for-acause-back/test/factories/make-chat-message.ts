import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ChatMessage,
  ChatMessageProps
} from '@/domain/enterprise/entities/chat-message';
import { PrismaChatMessageMapper } from '@/infra/database/prisma/mappers/prisma-chat-message-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeChatMessage(
  override: Partial<ChatMessageProps> = {},
  id?: UniqueEntityID
) {
  const chatmessage = ChatMessage.create(
    {
      authorId: new UniqueEntityID(),
      chatId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override
    },
    id
  );
  return chatmessage;
}
@Injectable()
export class ChatMessageFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaChatMessage(
    data: Partial<ChatMessageProps> = {}
  ): Promise<ChatMessage> {
    const chatmessage = makeChatMessage(data);
    await this.prisma.message.create({
      data: PrismaChatMessageMapper.toPrisma(chatmessage)
    });
    return chatmessage;
  }
}
