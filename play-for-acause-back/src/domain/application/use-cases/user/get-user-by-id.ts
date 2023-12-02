import { Either, left, right } from '@/core/entities/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from '@/domain/enterprise/entities/user';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface GetUserByIdUseCaseRequest {
  id: string;
}
type GetUserByIdUseCaseResponse = Either<ResourceNotFoundError, { user: User }>;
@Injectable()
export class GetUserByIdUseCase {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    id
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return left(new ResourceNotFoundError());
    }
    return right({
      user
    });
  }
}
