import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Chat, ChatProps } from '@/domain/enterprise/entities/chat';
import { PrismaChatMapper } from '@/infra/database/prisma/mappers/prisma-chat-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeChat(
  override: Partial<ChatProps> = {},
  id?: UniqueEntityID
) {
  const chat = Chat.create(
    {
      name: faker.person.firstName(),
      ...override
    },
    id
  );
  return chat;
}
@Injectable()
export class ChatFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaChat(data: Partial<ChatProps> = {}): Promise<Chat> {
    const chat = makeChat(data);
    await this.prisma.chat.create({
      data: PrismaChatMapper.toPrisma(chat)
    });
    return chat;
  }
}
