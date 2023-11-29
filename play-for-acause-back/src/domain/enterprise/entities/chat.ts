import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ChatUserList } from './chat-user-list'
import { ChatMessageList } from './chat-message-list'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
export interface ChatProps {
    users: ChatUserList
    messages: ChatMessageList
    createdAt: Date
    updatedAt?: Date | null
}
export class Chat extends AggregateRoot<ChatProps> {
    get users() {
        return this.props.users
    }
    get messages() {
        return this.props.messages
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }
    set users(users: ChatUserList) {
        this.props.users = users
        this.touch()
    }
    set messages(messages: ChatMessageList) {
        this.props.messages = messages
        this.touch()
    }
    touch() {
        this.props.updatedAt = new Date()
    }
    static create(
        props: Optional<ChatProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const chat = new Chat(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
        return chat
    }
}
