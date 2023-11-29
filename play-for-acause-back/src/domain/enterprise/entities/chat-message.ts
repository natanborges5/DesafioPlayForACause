import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ChatMessagesProps {
    chatId: UniqueEntityID
    messageId: UniqueEntityID
}
export class ChatMessage extends AggregateRoot<ChatMessagesProps> {
    get chatId() {
        return this.props.chatId
    }
    get messageId() {
        return this.props.messageId
    }
    static create(props: ChatMessagesProps, id?: UniqueEntityID) {
        const chatMessage = new ChatMessage(props, id)
        return chatMessage
    }
}
