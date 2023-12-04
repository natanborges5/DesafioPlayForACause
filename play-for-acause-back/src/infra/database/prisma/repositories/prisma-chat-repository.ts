import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatsRepository } from '@/domain/application/repositories/chat-repository';
import { Chat } from '@/domain/enterprise/entities/chat';
import { PrismaChatMapper } from '../mappers/prisma-chat-mapper';
import { PaginationParams } from '@/core/entities/pagination-params';
import { PrismaChatUserMapper } from '../mappers/prisma-chat-user-mapper';

@Injectable()
export class PrismaChatsRepository implements ChatsRepository {
  constructor(private prisma: PrismaService) {}
  async getNumberOfPages(userId: string): Promise<number> {
    const numberOfChats = await this.prisma.chat.count({
      where: {
        users: {
          some: {
            userId: userId
          }
        }
      }
    });
    const totalPages = Math.ceil(numberOfChats / 20);
    return totalPages;
  }
  async findManyRecentByUserId(
    { page }: PaginationParams,
    userId: string
  ): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: userId
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    });

    return chats.map(PrismaChatMapper.toDomain);
  }
  async findById(id: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id
      }
    });
    if (!chat) {
      return null;
    }
    return PrismaChatMapper.toDomain(chat);
  }
  async findManyRecent({ page }: PaginationParams): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    });
    return chats.map(PrismaChatMapper.toDomain);
  }
  async create(chat: Chat): Promise<void> {
    const data = PrismaChatMapper.toPrisma(chat);
    await this.prisma.chat.create({
      data
    });
    for (const user of chat.users.currentItems) {
      const userPrisma = PrismaChatUserMapper.toPrisma(user);
      await this.prisma.usersOnChats.create({
        data: userPrisma
      });
    }
  }
  async save(chat: Chat): Promise<void> {
    const data = PrismaChatMapper.toPrisma(chat);
    await this.prisma.chat.update({
      where: {
        id: data.id
      },
      data
    });
  }
  async delete(chat: Chat): Promise<void> {
    await this.prisma.chat.delete({
      where: {
        id: chat.id.toString()
      }
    });
  }
}
