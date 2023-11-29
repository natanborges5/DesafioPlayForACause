import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Chat, ChatProps } from '@/domain/enterprise/entities/chat'
import { faker } from '@faker-js/faker'

export function makeChat(
    override: Partial<ChatProps> = {},
    id?: UniqueEntityID,
) {
    const chat = Chat.create(
        {
            name: faker.person.firstName(),
            ...override,
        },
        id,
    )
    return chat
}