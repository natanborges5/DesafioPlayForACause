import { Either, right } from '@/core/entities/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from '@/domain/enterprise/entities/user';

interface GetUserByEmailUseCaseRequest {
  email: string;
}
type GetUserByEmailUseCaseResponse = Either<null, { users: User[] }>;
@Injectable()
export class GetUserByEmailUseCase {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    email
  }: GetUserByEmailUseCaseRequest): Promise<GetUserByEmailUseCaseResponse> {
    const users = await this.userRepository.findManyByEmail(email);
    return right({
      users
    });
  }
}
