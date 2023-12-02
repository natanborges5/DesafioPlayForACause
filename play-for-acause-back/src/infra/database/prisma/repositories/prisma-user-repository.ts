import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersRepository } from '@/domain/application/repositories/user-repository';
import { User } from '@/domain/enterprise/entities/user';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}
  async findManyByEmail(email: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
          mode: 'insensitive'
        }
      },
      take: 20
    });
    return users.map(PrismaUserMapper.toDomain);
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });
    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }
  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.create({
      data
    });
  }
}
