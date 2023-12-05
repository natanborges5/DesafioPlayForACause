import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Message, MessageProps } from './message';
import { Optional } from '@/core/types/optional';
import { ApiProperty } from '@nestjs/swagger';

export interface ChatMessageProps extends MessageProps {
  chatId: UniqueEntityID;
}
export class ChatMessage extends Message<ChatMessageProps> {
  @ApiProperty({
    example: new UniqueEntityID().toString(),
    description: 'The chat id of the message'
  })
  get chatId() {
    return this.props.chatId;
  }
  static create(
    props: Optional<ChatMessageProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const message = new ChatMessage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    );
    return message;
  }
}
