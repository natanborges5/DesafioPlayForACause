import { PaginationParams } from '@/core/entities/pagination-params';
import { Chat } from '../../enterprise/entities/chat'

export abstract class ChatsRepository {
    abstract findById(id: string): Promise<Chat | null>
    abstract findManyRecent(params: PaginationParams): Promise<Chat[]>
    abstract create(chat: Chat): Promise<void>
    abstract save(chat: Chat): Promise<void>
    abstract delete(chat: Chat): Promise<void>
}
