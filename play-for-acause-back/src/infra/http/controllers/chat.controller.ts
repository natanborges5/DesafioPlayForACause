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
import { CreateChatUseCase } from '@/domain/application/use-cases/chat/create-chat';
import { ChatPresenter } from '../presenters/chat-presenter';
import { FetchRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-recent-chats';
import { FetchUserRecentChatsUseCase } from '@/domain/application/use-cases/chat/fetch-user-recent-chats';

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
export class ChatController {
  constructor(
    private createChat: CreateChatUseCase,
    private fetchRecentChats: FetchRecentChatsUseCase,
    private fetchUserRecentChats: FetchUserRecentChatsUseCase
  ) {}
  @Get()
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
}
