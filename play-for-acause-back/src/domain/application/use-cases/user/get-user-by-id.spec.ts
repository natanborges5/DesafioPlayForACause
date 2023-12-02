import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { GetUserByIdUseCase } from './get-user-by-id';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserByIdUseCase;

describe('Get User By Id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserByIdUseCase(inMemoryUsersRepository);
  });

  it('Should be able to get a user by id', async () => {
    const newUser = makeUser({});
    await inMemoryUsersRepository.create(newUser);
    const result = await sut.execute({
      id: newUser.id.toString()
    });
    expect(result.value).toBeTruthy();
  });
});
