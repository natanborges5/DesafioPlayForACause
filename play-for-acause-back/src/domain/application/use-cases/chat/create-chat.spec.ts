import { CreateChatUseCase } from './create-chat';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserNotFoundError } from '../errors/usert-not-found-error';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';

let inMemoryChatsRepository: InMemoryChatsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let sut: CreateChatUseCase;

describe('Create Chat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    sut = new CreateChatUseCase(
      inMemoryChatsRepository,
      inMemoryUserRepository
    );
  });

  it('Should be able to create a chat', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    inMemoryUserRepository.create(user1);
    inMemoryUserRepository.create(user2);
    const result = await sut.execute({
      name: 'Group chat number 1',
      usersIds: [user1.id.toString(), user2.id.toString()]
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryChatsRepository.items[0].users.currentItems).toHaveLength(2);
    expect(inMemoryChatsRepository.items[0].users.currentItems).toEqual([
      expect.objectContaining({ userId: user1.id }),
      expect.objectContaining({ userId: user2.id })
    ]);
  });
  it('Should not be able to create a chat with a invalid user', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    inMemoryUserRepository.create(user2);
    const result = await sut.execute({
      name: 'Group chat number 1',
      usersIds: [user1.id.toString(), user2.id.toString()]
    });
    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
