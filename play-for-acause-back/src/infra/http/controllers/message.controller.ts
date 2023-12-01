import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Sse
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { MessagePresenter } from '../presenters/message-presenter';
import { MessageOnChatUseCase } from '@/domain/application/use-cases/message/message-on-chat';
import { FetchMessageByChatUseCase } from '@/domain/application/use-cases/message/fetch-message-by-chat';
import { Public } from '@/infra/auth/public';
import { Observable, from, interval, map, switchMap } from 'rxjs';

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
  @Public()
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
  @Public()
  @Sse('sse/:chatId')
  sse(@Param('chatId') chatId: string): Observable<MessageEvent> {
    console.log(chatId);
    return interval(1000).pipe(
      switchMap(() =>
        from(this.fetchMessagesByChat.execute({ chatId, page: 1 }))
      ),
      map((result) => {
        if (result.isRight()) {
          const messages = result.value.chatMessages;
          return { data: messages.map(MessagePresenter.toHTTP) };
        }
        return null;
      }),
      map((data) => ({ data }) as MessageEvent)
    );
  }
}
