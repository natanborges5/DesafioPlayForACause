import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ChatMessage,
  ChatMessageProps
} from '@/domain/enterprise/entities/chat-message';

import { faker } from '@faker-js/faker';

export function makeChatMessage(
  override: Partial<ChatMessageProps> = {},
  id?: UniqueEntityID
) {
  const chatmessage = ChatMessage.create(
    {
      authorId: new UniqueEntityID(),
      chatId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override
    },
    id
  );
  return chatmessage;
}
