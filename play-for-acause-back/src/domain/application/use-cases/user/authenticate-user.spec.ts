import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateUserUseCase } from './authenticate-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeUser } from 'test/factories/make-student';
import { faker } from '@faker-js/faker';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it('Should be able to authenticate a user', async () => {
    const password = faker.internet.password();
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash(password)
    });
    await inMemoryUsersRepository.create(user);
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: password
    });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    });
  });
});
