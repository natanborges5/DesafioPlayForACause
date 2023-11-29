import { ChatMessagesRepository } from "@/domain/application/repositories/chat-messages-repository"
import { ChatMessage } from "@/domain/enterprise/entities/chat-message"

export class InMemoryChatMessagesRepository
    implements ChatMessagesRepository
{
    async deleteManyByChatId(chatId: string) {
        const chatMessages = this.items.filter(
            (item) => item.chatId.toString() !== chatId,
        )
        this.items = chatMessages
    }
    public items: ChatMessage[] = []
    async findManyByChatId(chatId: string) {
        const chatMessages = this.items.filter(
            (item) => item.chatId.toString() === chatId,
        )
        return chatMessages
    }
}
