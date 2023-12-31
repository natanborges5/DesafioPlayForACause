import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatMessagesRepository } from '@/domain/application/repositories/chat-messages-repository';
import { ChatMessage } from '@/domain/enterprise/entities/chat-message';
import { PrismaChatMessageMapper } from '../mappers/prisma-chat-message-mapper';
import { PaginationParams } from '@/core/entities/pagination-params';

@Injectable()
export class PrismaChatMessageRepository implements ChatMessagesRepository {
  constructor(private prisma: PrismaService) {}
  async getNumberOfPages(chatId: string): Promise<number> {
    const numberOfMessages = await this.prisma.message.count({
      where: {
        chatId: chatId
      }
    });
    const totalPages = Math.ceil(numberOfMessages / 20);
    return totalPages;
  }
  async findById(id: string): Promise<ChatMessage | null> {
    const message = await this.prisma.message.findUnique({
      where: {
        id
      }
    });
    if (!message) {
      return null;
    }
    return PrismaChatMessageMapper.toDomain(message);
  }
  async delete(chatMessage: ChatMessage): Promise<void> {
    await this.prisma.message.delete({
      where: {
        id: chatMessage.id.toString()
      }
    });
  }
  async create(chatMessage: ChatMessage): Promise<void> {
    const data = PrismaChatMessageMapper.toPrisma(chatMessage);
    await this.prisma.message.create({
      data
    });
  }
  async findManyByChatId(
    chatId: string,
    { page }: PaginationParams
  ): Promise<ChatMessage[]> {
    const serviceEmployees = await this.prisma.message.findMany({
      where: {
        chatId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (page - 1) * 20
    });
    return serviceEmployees.map(PrismaChatMessageMapper.toDomain);
  }
  async deleteManyByChatId(chatId: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: {
        chatId
      }
    });
  }
}
