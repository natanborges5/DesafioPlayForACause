import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ChatUsersProps {
  chatId: UniqueEntityID;
  userId: UniqueEntityID;
  createdAt: Date;
}
export class ChatUser extends AggregateRoot<ChatUsersProps> {
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
    props: Optional<ChatUsersProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const chatUser = new ChatUser(
      {
        ...props,
        createdAt: new Date()
      },
      id
    );
    return chatUser;
  }
}
