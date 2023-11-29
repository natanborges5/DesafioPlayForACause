import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { CreateChatUseCase } from './create-chat';
import { makeUser } from 'test/factories/make-student';

let inMemoryChatsRepository: InMemoryChatsRepository;
let sut: CreateChatUseCase;

describe('Create Chat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository();
    sut = new CreateChatUseCase(inMemoryChatsRepository);
  });

  it('Should be able to create a chat', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const result = await sut.execute({
      name: 'Group chat number 1',
      usersIds: [user1.id.toString(), user2.id.toString()]
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryChatsRepository.items[0]).toEqual(result.value?.chat);
    expect(inMemoryChatsRepository.items[0].users.currentItems).toHaveLength(2);
    expect(inMemoryChatsRepository.items[0].users.currentItems).toEqual([
      expect.objectContaining({ userId: user1.id }),
      expect.objectContaining({ userId: user2.id })
    ]);
  });
});
