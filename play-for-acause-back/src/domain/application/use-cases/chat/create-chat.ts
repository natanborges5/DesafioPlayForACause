import { Either, right } from '@/core/entities/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Chat } from '@/domain/enterprise/entities/chat'
import { Injectable } from '@nestjs/common'
import { ChatsRepository } from '../../repositories/chat-repository'
import { ChatMessage } from '@/domain/enterprise/entities/chat-message'
import { ChatMessageList } from '@/domain/enterprise/entities/chat-message-list'
import { ChatUser } from '@/domain/enterprise/entities/chat-user'
import { ChatUserList } from '@/domain/enterprise/entities/chat-user-list'

interface CreateChatUseCaseRequest {
    name: string
    usersIds: string[]
    messagesIds: string[]
}
type CreateChatUseCaseResponse = Either<
    null,
    {
        chat: Chat
    }
>
@Injectable()
export class CreateChatUseCase {
    constructor(private chatRepository: ChatsRepository) {}
    async execute({
        name,
        usersIds,
        messagesIds,
    }: CreateChatUseCaseRequest): Promise<CreateChatUseCaseResponse> {
        const chat = Chat.create({
            name,
        })
        const chatMessages = messagesIds.map((messageId) => {
            return ChatMessage.create({
                messageId: new UniqueEntityID(messageId),
                chatId: chat.id,
            })
        })
        chat.messages = new ChatMessageList(chatMessages)

        const chatUsers = usersIds.map((userId) => {
            return ChatUser.create({
                userId: new UniqueEntityID(userId),
                chatId: chat.id,
            })
        })
        chat.users = new ChatUserList(chatUsers)
        await this.chatRepository.create(chat)
        return right({
            chat,
        })
    }
}
