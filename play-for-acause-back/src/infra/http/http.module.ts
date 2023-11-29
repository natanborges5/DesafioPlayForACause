import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/user/authenticate-user';
import { RegisterUserUseCase } from '@/domain/application/use-cases/user/register-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUserUseCase, RegisterUserUseCase]
})
export class HttpModule {}
