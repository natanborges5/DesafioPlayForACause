import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Sse
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { CreateChatUseCase } from '@/domain/application/use-cases/chat/create-chat';
import { ChatPresenter } from '../presenters/chat-presenter';
import { FetchRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-recent-chats';
import { FetchUserRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-user-recent-chats';
import { Public } from '@/infra/auth/public';
import { Observable, from, interval, map, switchMap } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';
import { Chat } from '@/domain/enterprise/entities/chat';

const chatSchema = z.object({
  name: z.string(),
  usersIds: z.string().array()
});
const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const userIdQueryParamSchema = z.string();
const userQueryValidationPipe = new ZodValidationPipe(userIdQueryParamSchema);
type UserQueryParamSchema = z.infer<typeof userIdQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
type ChatBodySchema = z.infer<typeof chatSchema>;
@Controller('/chats')
@ApiTags('ChatPlay')
@ApiBearerAuth('defaultBearerAuth')
export class ChatController {
  constructor(
    private createChat: CreateChatUseCase,
    private fetchRecentChats: FetchRecentChatsUseCase,
    private fetchUserRecentChats: FetchUserRecentChatsUseCase
  ) {}
  @Get()
  //Swagger
  @ApiOperation({ summary: 'Fetch recent chats' })
  @ApiResponse({
    status: 200,
    description: 'Chats found',
    type: [Chat]
  })
  //Fim do Swagger
  async handleFetchRecentChats(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.fetchRecentChats.execute({ page });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const chats = result.value.chats;
    return {
      chats: chats.map(ChatPresenter.toHTTP)
    };
  }
  @Get('/user')
  //Swagger
  @ApiOperation({ summary: 'Find users recent chats by user id' })
  @ApiResponse({
    status: 200,
    description: 'Chats found',
    type: [Chat]
  })
  //Fim do Swagger
  async handleFetchUserRecentChats(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('userId', userQueryValidationPipe) userId: UserQueryParamSchema
  ) {
    const result = await this.fetchUserRecentChats.execute({ page, userId });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const chats = result.value.chats;
    return {
      chats: chats.map(ChatPresenter.toHTTP)
    };
  }
  @Post()
  @HttpCode(201)
  //Swagger
  @ApiOperation({ summary: 'Create Chat' })
  @ApiResponse({
    status: 201,
    description: 'Created Chat',
    type: Chat
  })
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({
    type: Chat,
    description: 'Json structure for Chat object'
  })
  //Fim do Swagger
  async handlePostChat(
    @Body(new ZodValidationPipe(chatSchema)) body: ChatBodySchema
  ) {
    const { name, usersIds } = body;
    const result = await this.createChat.execute({
      name,
      usersIds
    });
    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }
  }
  /* The `sse` method in the `ChatController` class is a server-sent events (SSE) endpoint that allows
clients to subscribe to real-time updates for recent chats by a specific user. */
  @Public()
  @Sse('/sse')
  //Swagger
  @ApiOperation({ summary: 'SSE for recent chats by user' })
  @ApiResponse({
    status: 200,
    description: 'Chats found',
    type: [Chat]
  })
  //Fim do Swagger
  sse(
    @Query('userId') userId: string,
    @Query('page') page: number
  ): Observable<MessageEvent> {
    return interval(1000).pipe(
      switchMap(() =>
        from(this.fetchUserRecentChats.execute({ userId, page }))
      ),
      map((result) => {
        if (result.isRight()) {
          const { chats, totalPages } = result.value;
          return {
            data: {
              chats: chats.map(ChatPresenter.toHTTP),
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
