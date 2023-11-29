import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';
import { UsersOnChats as PrismaUserChat, Prisma } from '@prisma/client';

export class PrismaChatUserMapper {
  static toDomain(raw: PrismaUserChat): ChatUser {
    return ChatUser.create(
      {
        userId: new UniqueEntityID(raw.userId),
        chatId: new UniqueEntityID(raw.chatId),
        createdAt: new Date()
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrisma(chatUser: ChatUser): Prisma.UsersOnChatsUncheckedCreateInput {
    return {
      userId: chatUser.userId.toString(),
      chatId: chatUser.chatId.toString()
    };
  }
}
