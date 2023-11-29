import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ChatUser,
  ChatUserProps
} from '@/domain/enterprise/entities/chat-user';
import { PrismaChatUserMapper } from '@/infra/database/prisma/mappers/prisma-chat-user-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeChatUser(
  override: Partial<ChatUserProps> = {},
  id?: UniqueEntityID
) {
  const chatuser = ChatUser.create(
    {
      userId: new UniqueEntityID(),
      chatId: new UniqueEntityID(),
      ...override
    },
    id
  );
  return chatuser;
}
@Injectable()
export class ChatUserFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaChatUser(
    data: Partial<ChatUserProps> = {}
  ): Promise<ChatUser> {
    const chatuser = makeChatUser(data);
    await this.prisma.usersOnChats.create({
      data: PrismaChatUserMapper.toPrisma(chatuser)
    });
    return chatuser;
  }
}
