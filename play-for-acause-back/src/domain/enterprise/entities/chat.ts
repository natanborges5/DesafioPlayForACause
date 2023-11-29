import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ApiProperty } from '@nestjs/swagger'
export interface ChatProps {
    users: string
    messages: string
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
    set users(users: string) {
        this.props.users = users
        this.touch()
    }
    set messages(messages: string) {
        this.props.messages = messages
        this.touch()
    }
    touch() {
        this.props.updatedAt = new Date()
    }
}
