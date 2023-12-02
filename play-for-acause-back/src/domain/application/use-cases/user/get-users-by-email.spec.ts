import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { GetUserByEmailUseCase } from './get-users-by-email';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserByEmailUseCase;

describe('Get User By Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserByEmailUseCase(inMemoryUsersRepository);
  });

  it('Should be able to get a user by email', async () => {
    const newUser = makeUser({});
    await inMemoryUsersRepository.create(newUser);
    const result = await sut.execute({
      email: newUser.email.toString()
    });
    expect(result.value).toBeTruthy();
  });
});
