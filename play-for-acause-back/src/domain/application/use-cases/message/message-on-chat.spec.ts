import { InMemoryChatMessagesRepository } from 'test/repositories/in-memory-chat-messages-repository'
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository'
import { MessageOnChatUseCase } from './message-on-chat'
import { makeChat } from 'test/factories/make-chat'
import { InMemoryChatUsersRepository } from 'test/repositories/in-memory-chat-users-repository'
import { makeUser } from 'test/factories/make-student'
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list'

let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryChatMessagesRepository: InMemoryChatMessagesRepository
let inMemoryChatUsersRepository: InMemoryChatUsersRepository
let sut: MessageOnChatUseCase

describe('Message on Chat', () => {
    beforeEach(() => {
        inMemoryChatUsersRepository =new InMemoryChatUsersRepository()
        inMemoryChatMessagesRepository =new InMemoryChatMessagesRepository()
        inMemoryChatsRepository = new InMemoryChatsRepository()
        sut = new MessageOnChatUseCase(
            inMemoryChatsRepository,
            inMemoryChatMessagesRepository,
        )
    })

    it('Should be able to message on chat', async () => {

        const user1 = makeUser()
        const chat = makeChat()
        await inMemoryChatsRepository.create(chat)
        await sut.execute({
            chatId: chat.id.toString(),
            authorId: user1.id.toString(),
            content: 'Comentario Teste',
        })
        expect(inMemoryChatMessagesRepository.items[0]).toEqual(
            expect.objectContaining({
                authorId: user1.id,
                chatId: chat.id,
                content:'Comentario Teste',
            })
        )
    })
})
