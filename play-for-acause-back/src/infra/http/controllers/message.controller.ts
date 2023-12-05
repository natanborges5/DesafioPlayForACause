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
import { Observable, from, interval, map, switchMap } from 'rxjs';
import { GetMessageByIdUseCase } from '@/domain/application/use-cases/message/get-message-by-id';
import { Public } from '@/infra/auth/public';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBody
} from '@nestjs/swagger';
import { Message } from '@/domain/enterprise/entities/message';

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
@ApiTags('ChatPlay')
@ApiBearerAuth('defaultBearerAuth')
export class MessageController {
  constructor(
    private messageOnChat: MessageOnChatUseCase,
    private fetchMessagesByChat: FetchMessageByChatUseCase,
    private getMessageById: GetMessageByIdUseCase
  ) {}
  @Get()
  //Swagger
  @ApiOperation({ summary: 'Fetch recent messages by chat' })
  @ApiResponse({
    status: 200,
    description: 'Messages found',
    type: [Message]
  })
  //Fim do Swagger
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
      messages: messages.map(MessagePresenter.toHTTP),
      totalPages: result.value.totalPages
    };
  }
  @Post()
  @HttpCode(201)
  //Swagger
  @ApiOperation({ summary: 'Create Message' })
  @ApiResponse({
    status: 201,
    description: 'Created Message',
    type: Message
  })
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({
    type: Message,
    description: 'Json structure for Message object'
  })
  //Fim do Swagger
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
  @Get('/:messageId')
  //Swagger
  @ApiOperation({ summary: 'Get message by id' })
  @ApiResponse({
    status: 200,
    description: 'Message found',
    type: Message
  })
  //Fim do Swagger
  async handleGetMessageByIdMessages(
    @Param('messageId', userIdQueryValidationPipe)
    messageId: UserIdQueryParamSchema
  ) {
    const result = await this.getMessageById.execute({ id: messageId });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const message = result.value.message;
    return {
      message: MessagePresenter.toHTTP(message)
    };
  }
  /* The `sse` method in the `MessageController` class is a server-sent events (SSE) endpoint that allows
clients to subscribe to real-time updates for recent messages in a chat. */
  @Public()
  @Sse('sse/:chatId')
  //Swagger
  @ApiOperation({ summary: 'SSE for recent messages by chat' })
  @ApiResponse({
    status: 200,
    description: 'Messages found',
    type: [Message]
  })
  //Fim do Swagger
  sse(
    @Param('chatId') chatId: string,
    @Query('page') page: string
  ): Observable<MessageEvent> {
    return interval(1000).pipe(
      switchMap(() =>
        from(this.fetchMessagesByChat.execute({ chatId, page: +page || 1 }))
      ),
      map((result) => {
        if (result.isRight()) {
          const { chatMessages, totalPages } = result.value;
          return {
            data: {
              messages: chatMessages.map(MessagePresenter.toHTTP),
              totalPages
            }
          };
        }
        return null;
      }),
      map((data) => ({ data }) as MessageEvent)
    );
  }
}
