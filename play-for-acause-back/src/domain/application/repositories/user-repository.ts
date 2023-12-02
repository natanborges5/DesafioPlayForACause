import { User } from '@/domain/enterprise/entities/user';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findManyByEmail(email: string): Promise<User[]>;
  abstract findById(id: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
