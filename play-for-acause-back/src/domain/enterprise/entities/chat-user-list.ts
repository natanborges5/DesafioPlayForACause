import { WatchedList } from '@/core/entities/watched-list'
import { ChatUser } from './chat-user'
type ChatUserString = {
    id: string
    userId: string
}
export class ChatUserList extends WatchedList<ChatUser> {
    compareItems(a: ChatUser, b: ChatUser): boolean {
        return a.userId === b.userId
    }
    listToString(): ChatUserString[] {
        const newList: ChatUserString[] = []
        this.currentItems.forEach(user => {
            newList.push({
                id: user.id.toString(),
                userId: user.userId.toString(),
            })
        });
        return newList
    }
}
