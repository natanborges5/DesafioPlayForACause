import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ChatUserProps {
  chatId: UniqueEntityID;
  userId: UniqueEntityID;
  createdAt: Date;
}
export class ChatUser extends AggregateRoot<ChatUserProps> {
  get chatId() {
    return this.props.chatId;
  }
  get userId() {
    return this.props.userId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  static create(
    props: Optional<ChatUserProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const chatUser = new ChatUser(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    );
    return chatUser;
  }
}
