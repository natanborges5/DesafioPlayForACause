import { WatchedList } from '@/core/entities/watched-list'
import { ChatMessage } from './chat-message'
type ChatMessageString = {
    id: string
    messageId: string
}
export class ChatMessageList extends WatchedList<ChatMessage> {
    compareItems(a: ChatMessage, b: ChatMessage): boolean {
        return a.messageId === b.messageId
    }
    listToString(): ChatMessageString[] {
        const newList: ChatMessageString[] = []
        this.currentItems.forEach(message => {
            newList.push({
                id: message.id.toString(),
                messageId: message.messageId.toString(),
            })
        });
        return newList
    }
}
