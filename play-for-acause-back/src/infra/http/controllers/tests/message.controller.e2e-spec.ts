import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { ChatMessageFactory } from 'test/factories/make-chat-message';
import { UserFactory } from 'test/factories/make-user';
describe('Message (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let chatFactory: ChatFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ChatFactory, ChatMessageFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    chatFactory = moduleRef.get(ChatFactory);
    await app.init();
  });
  test('[POST] /messages', async () => {
    const user = await userFactory.makePrismaUser();
    const chat = await chatFactory.makePrismaChat();
    const accessToken = jwt.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        authorId: user.id.toString(),
        chatId: chat.id.toString(),
        content: faker.lorem.text()
      });
    expect(response.statusCode).toBe(201);
    const chatOnDatabase = await prisma.message.findFirst({
      where: {
        authorId: user.id.toString()
      }
    });
    expect(chatOnDatabase).toBeTruthy();
  });
  test('[GET] /messages Fetch recent message by chat', async () => {
    const user = await userFactory.makePrismaUser();
    const chat = await chatFactory.makePrismaChat();
    const accessToken = jwt.sign({ sub: user.id.toString() });
    for (let i = 0; i < 10; i++) {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          authorId: user.id.toString(),
          chatId: chat.id.toString(),
          content: faker.lorem.text()
        });
    }
    const response = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: '1', chatId: chat.id.toString() });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      messages: expect.arrayContaining([
        expect.objectContaining({ authorId: user.id.toString() }),
        expect.objectContaining({ authorId: user.id.toString() }),
        expect.objectContaining({ authorId: user.id.toString() }),
        expect.objectContaining({ authorId: user.id.toString() })
      ]),
      totalPages: 1
    });
  });
});
