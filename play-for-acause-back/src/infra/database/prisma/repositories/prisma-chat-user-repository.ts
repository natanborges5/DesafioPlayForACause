import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ChatUsersRepository } from '@/domain/application/repositories/chat-users-repository';
import { ChatUser } from '@/domain/enterprise/entities/chat-user';
import { PrismaChatUserMapper } from '../mappers/prisma-chat-user-mapper';

@Injectable()
export class PrismaChatsUserRepository implements ChatUsersRepository {
  constructor(private prisma: PrismaService) {}
  async create(chatUser: ChatUser): Promise<void> {
    const data = PrismaChatUserMapper.toPrisma(chatUser);
    await this.prisma.usersOnChats.create({
      data
    });
  }
  async findManyByChatId(chatId: string): Promise<ChatUser[]> {
    const serviceEmployees = await this.prisma.usersOnChats.findMany({
      where: {
        chatId
      }
    });
    return serviceEmployees.map(PrismaChatUserMapper.toDomain);
  }
  async deleteManyByChatId(chatId: string): Promise<void> {
    await this.prisma.usersOnChats.deleteMany({
      where: {
        chatId
      }
    });
  }
}
