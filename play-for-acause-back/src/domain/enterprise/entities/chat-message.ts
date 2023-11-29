import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Message, MessageProps } from './message'
import { Optional } from '@/core/types/optional'

export interface ChatMessageProps extends MessageProps {
    chatId: UniqueEntityID
}
export class ChatMessage extends Message<ChatMessageProps> {
    get chatId() {
        return this.props.chatId
    }
    static create(
        props: Optional<ChatMessageProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const message = new ChatMessage(
            {
                ...props,
                createdAt: new Date(),
            },
            id,
        )
        return message
    }
}
