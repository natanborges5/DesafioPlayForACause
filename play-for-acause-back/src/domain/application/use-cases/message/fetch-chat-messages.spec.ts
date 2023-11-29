import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository';
import { FetchChatMessagesUseCase } from './fetch-chat-messages';
import { makeChatMessage } from 'test/factories/make-chat-message';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository;
let sut: FetchChatMessagesUseCase;

describe('Fetch Chat messages', () => {
  beforeEach(() => {
    inMemoryChatMessagesRepository = new InMemoryChatMessagesRepository();
    sut = new FetchChatMessagesUseCase(inMemoryChatMessagesRepository);
  });

  it('Should be able to fetch chat messages', async () => {
    await inMemoryChatMessagesRepository.create(
      makeChatMessage({
        chatId: new UniqueEntityID('chat-1')
      })
    );
    await inMemoryChatMessagesRepository.create(
      makeChatMessage({
        chatId: new UniqueEntityID('chat-1')
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
    expect(result.value?.chatMessages).toHaveLength(3);
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
