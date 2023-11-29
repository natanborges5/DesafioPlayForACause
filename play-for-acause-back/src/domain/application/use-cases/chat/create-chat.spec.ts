
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository'
import { CreateChatUseCase } from './create-chat'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryChatUsersRepository } from 'test/repositories/in-memory-chat-users-repository'


let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryChatUsersRepository: InMemoryChatUsersRepository
let sut: CreateChatUseCase

describe('Create Chat', () => {
    beforeEach(() => {
        inMemoryChatMessagesRepository =
            new InMemoryChatMessagesRepository()
        inMemoryChatUsersRepository =
        new InMemoryChatUsersRepository()
        inMemoryChatsRepository = new InMemoryChatsRepository(
            inMemoryChatMessagesRepository,
        )
        sut = new CreateChatUseCase(inMemoryChatsRepository)
    })

    it('Should be able to create a chat', async () => {
        const result = await sut.execute({
            name: 'Group chat number 1',
            usersIds: ["1", "2"],
            messagesIds: ['1', '2'],
        })
        expect(result.isRight()).toBe(true)
        expect(inMemoryChatsRepository.items[0]).toEqual(
            result.value?.chat,
        )
        expect(
            inMemoryChatsRepository.items[0].messages.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryChatsRepository.items[0].messages.currentItems,
        ).toEqual([
            expect.objectContaining({ messageId: new UniqueEntityID('1') }),
            expect.objectContaining({ messageId: new UniqueEntityID('2') }),
        ])
        
        expect(
            inMemoryChatsRepository.items[0].users.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryChatsRepository.items[0].users.currentItems,
        ).toEqual([
            expect.objectContaining({ userId: new UniqueEntityID('1') }),
            expect.objectContaining({ userId: new UniqueEntityID('2') }),
        ])
    })
})
