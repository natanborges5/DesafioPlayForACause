import { AggregateRoot } from '@/core/entities/aggregate-root';
import { ChatUserList } from './chat-user-list';
import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ApiProperty } from '@nestjs/swagger';
export interface ChatProps {
  name: string;
  users: ChatUserList;
  lastMessageId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class Chat extends AggregateRoot<ChatProps> {
  @ApiProperty({
    example: 'Soccer Sunday',
    description: 'The name of the chat'
  })
  get name() {
    return this.props.name;
  }
  @ApiProperty({
    example: [new UniqueEntityID().toString(), new UniqueEntityID().toString()],
    description: 'Users ids'
  })
  get users() {
    return this.props.users;
  }
  get lastMessageId() {
    return this.props.lastMessageId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  set name(name: string) {
    this.props.name = name;
    this.touch();
  }
  set users(users: ChatUserList) {
    this.props.users = users;
    this.touch();
  }
  set lastMessageId(lastMessageId: UniqueEntityID | undefined | null) {
    if (lastMessageId !== this.props.lastMessageId)
      this.props.lastMessageId = lastMessageId;
    this.touch();
  }
  touch() {
    this.props.updatedAt = new Date();
  }
  static create(
    props: Optional<ChatProps, 'createdAt' | 'users'>,
    id?: UniqueEntityID
  ) {
    const chat = new Chat(
      {
        ...props,
        users: props.users ?? new ChatUserList(),
        createdAt: props.createdAt ?? new Date()
      },
      id
    );
    return chat;
  }
}
