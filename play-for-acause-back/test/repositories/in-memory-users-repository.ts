import { UsersRepository } from '@/domain/application/repositories/user-repository';
import { User } from '@/domain/enterprise/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  async findManyByEmail(email: string) {
    const users = this.items.filter((item) => item.email === email);
    if (!users) {
      return [];
    }
    return users;
  }
  public items: User[] = [];
  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email.toString() === email);
    if (!user) {
      return null;
    }
    return user;
  }
  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id);
    if (!user) {
      return null;
    }
    return user;
  }
  async create(user: User) {
    this.items.push(user);
  }
}
