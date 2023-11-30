import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { MessagePresenter } from '../presenters/message-presenter';
import { MessageOnChatUseCase } from '@/domain/application/use-cases/message/message-on-chat';
import { FetchMessageByChatUseCase } from '@/domain/application/use-cases/message/fetch-message-by-chat';

const messageSchema = z.object({
  authorId: z.string().uuid(),
  chatId: z.string().uuid(),
  content: z.string()
});
const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));
const userIdQueryParamSchema = z.string();
const userIdQueryValidationPipe = new ZodValidationPipe(userIdQueryParamSchema);
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
type UserIdQueryParamSchema = z.infer<typeof userIdQueryParamSchema>;
type MessageBodySchema = z.infer<typeof messageSchema>;
@Controller('/messages')
export class MessageController {
  constructor(
    private messageOnChat: MessageOnChatUseCase,
    private fetchMessagesByChat: FetchMessageByChatUseCase
  ) {}
  @Get()
  async handleFetchRecentMessages(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('chatId', userIdQueryValidationPipe) chatId: UserIdQueryParamSchema
  ) {
    const result = await this.fetchMessagesByChat.execute({ chatId, page });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const messages = result.value.chatMessages;
    return {
      messages: messages.map(MessagePresenter.toHTTP)
    };
  }
  @Post()
  @HttpCode(201)
  async handlePostMessage(
    @Body(new ZodValidationPipe(messageSchema)) body: MessageBodySchema
  ) {
    const { authorId, chatId, content } = body;
    const result = await this.messageOnChat.execute({
      authorId,
      chatId,
      content
    });
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
}
