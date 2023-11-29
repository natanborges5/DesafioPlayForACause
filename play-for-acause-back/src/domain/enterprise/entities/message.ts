import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ApiProperty } from '@nestjs/swagger'

export interface MessageProps {
    content: string
    senderId: UniqueEntityID
    receiverId: UniqueEntityID
    createdAt: Date
    updatedAt?: Date
}
export class Message extends AggregateRoot<MessageProps> {
    @ApiProperty({ example: 'Hellow world', description: 'Conteudo da mensagem' })
    get content() {
        return this.props.content
    }
    @ApiProperty({ example: new UniqueEntityID().toString(), description: 'Id do sender' })
    get senderId() {
        return this.props.senderId
    }
    @ApiProperty({ example: new UniqueEntityID().toString(), description: 'Id do receiver' })
    get receiverId() {
        return this.props.receiverId
    }
    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }
    private touch() {
        this.props.updatedAt = new Date()
    }
    set content(content: string) {
        this.props.content = content
        this.touch()
    }
    set senderId(senderId: UniqueEntityID) {
        this.props.senderId = senderId
        this.touch()
    }
    set receiverId(receiverId: UniqueEntityID) {
        this.props.receiverId = receiverId
        this.touch()
    }
    static create(
        props: Optional<MessageProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const message = new Message(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )
        return message
    }
}
