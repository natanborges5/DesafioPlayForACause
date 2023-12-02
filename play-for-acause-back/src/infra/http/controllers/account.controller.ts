import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';
import { RegisterUserUseCase } from '@/domain/application/use-cases/user/register-user';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { GetUserByEmailUseCase } from '@/domain/application/use-cases/user/get-users-by-email';
import { UserPresenter } from '../presenters/user-presenter';
const accountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});
type AccountBodySchema = z.infer<typeof accountSchema>;
@Controller('/accounts')
export class AccountController {
  constructor(
    private registerUser: RegisterUserUseCase,
    private getUsersByEmail: GetUserByEmailUseCase
  ) {}

  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(accountSchema))
  async handleCreateAccount(@Body() body: AccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerUser.execute({
      name,
      email,
      password
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
  @Get('/:email')
  @HttpCode(200)
  async handleFetchRecentChats(@Param('email') email: string) {
    const result = await this.getUsersByEmail.execute({ email });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const users = result.value.users;
    return {
      users: users.map(UserPresenter.toHTTP)
    };
  }
}
