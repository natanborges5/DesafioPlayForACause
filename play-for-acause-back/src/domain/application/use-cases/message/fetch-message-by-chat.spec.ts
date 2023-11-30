import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository';
import { makeChatMessage } from 'test/factories/make-chat-message';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchMessageByChatUseCase } from './fetch-message-by-chat';

let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository;
let sut: FetchMessageByChatUseCase;

describe('Fetch Chat messages', () => {
  beforeEach(() => {
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository();
    sut = new FetchMessageByChatUseCase(inMemoryChatMessagesRepository);
  });

  it('Should be able to fetch chat messages', async () => {
    await inMemoryChatMessagesRepository.create(
      makeChatMessage({
        chatId: new UniqueEntityID('chat-1')
      })
    );
    await inMemoryChatMessagesRepository.create(
      makeChatMessage({
        chatId: new UniqueEntityID('chat-2')
      })
    );
    await inMemoryChatMessagesRepository.create(
      makeChatMessage({
        chatId: new UniqueEntityID('chat-1')
      })
    );

    const result = await sut.execute({
      chatId: 'chat-1',
      page: 1
    });
    expect(result.value?.chatMessages).toHaveLength(2);
    expect(result.value?.chatMessages).toEqual([
      expect.objectContaining({ chatId: new UniqueEntityID('chat-1') }),
      expect.objectContaining({ chatId: new UniqueEntityID('chat-1') })
    ]);
  });
  it('Should be able to fetch paginated chat messages', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryChatMessagesRepository.create(
        makeChatMessage({
          chatId: new UniqueEntityID('chat-1')
        })
      );
    }
    const result = await sut.execute({
      chatId: 'chat-1',
      page: 2
    });
    expect(result.value?.chatMessages).toHaveLength(2);
  });
});
