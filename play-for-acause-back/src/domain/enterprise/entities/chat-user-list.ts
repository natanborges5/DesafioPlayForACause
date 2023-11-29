import { WatchedList } from '@/core/entities/watched-list';
import { ChatUser } from './chat-user';
export class ChatUserList extends WatchedList<ChatUser> {
  compareItems(a: ChatUser, b: ChatUser): boolean {
    return a.userId === b.userId;
  }
  listToString(): string[] {
    const newList: string[] = [];
    this.currentItems.forEach((user) => {
      newList.push(user.userId.toString());
    });
    return newList;
  }
}
