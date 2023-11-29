import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/user/authenticate-user';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
const AuthenticateSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>;
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}
  @Post()
  @Public()
  @UsePipes(new ZodValidationPipe(AuthenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;
    const result = await this.authenticateUser.execute({
      email,
      password
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
    const { accessToken } = result.value;
    return {
      access_token: accessToken
    };
  }
}
