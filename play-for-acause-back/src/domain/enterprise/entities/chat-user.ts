import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface ChatUsersProps {
  chatId: UniqueEntityID;
  userId: UniqueEntityID;
}
export class ChatUser extends AggregateRoot<ChatUsersProps> {
  get chatId() {
    return this.props.chatId;
  }
  get userId() {
    return this.props.userId;
  }
  static create(props: ChatUsersProps, id?: UniqueEntityID) {
    const chatUser = new ChatUser(props, id);
    return chatUser;
  }
}
