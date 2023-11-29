import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { makeChat } from 'test/factories/make-chat';
import { FetchRecentChatsUseCase } from './fetch-recent-chats';

let inMemoryChatsRepository: InMemoryChatsRepository;
let sut: FetchRecentChatsUseCase;

describe('Fetch recent chats', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository();
    sut = new FetchRecentChatsUseCase(inMemoryChatsRepository);
  });

  it('Should be able to fetch recent chats', async () => {
    await inMemoryChatsRepository.create(
      makeChat({ createdAt: new Date(2022, 0, 20) })
    );
    await inMemoryChatsRepository.create(
      makeChat({ createdAt: new Date(2022, 0, 18) })
    );
    await inMemoryChatsRepository.create(
      makeChat({ createdAt: new Date(2022, 0, 23) })
    );

    const result = await sut.execute({
      page: 1
    });
    expect(result.value?.chats).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) })
    ]);
  });
  it('Should be able to fetch paginated recent chats', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryChatsRepository.create(makeChat());
    }
    const result = await sut.execute({
      page: 2
    });
    expect(result.value?.chats).toHaveLength(2);
  });
});
