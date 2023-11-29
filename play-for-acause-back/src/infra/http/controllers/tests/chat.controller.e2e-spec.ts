import { User } from '@/domain/enterprise/entities/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
describe('Chats (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    await app.init();
  });
  test('[POST] /chats', async () => {
    const user = await userFactory.makePrismaUser();
    const user2 = await userFactory.makePrismaUser();

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New chat',
        usersIds: [user.id.toString(), user2.id.toString()]
      });
    expect(response.statusCode).toBe(201);
    const chatOnDatabase = await prisma.chat.findFirst({
      where: {
        name: 'New chat'
      }
    });
    expect(chatOnDatabase).toBeTruthy();
  });
  test('[GET] /chats Fetch recent chats', async () => {
    const user = await userFactory.makePrismaUser();
    const usersToSend: User[] = [
      await userFactory.makePrismaUser(),
      await userFactory.makePrismaUser(),
      await userFactory.makePrismaUser()
    ];
    const accessToken = jwt.sign({ sub: user.id.toString() });
    for (let i = 0; i < usersToSend.length; i++) {
      await request(app.getHttpServer())
        .post('/chats')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: `New chat 0${i + 1}`,
          usersIds: [user.id.toString(), usersToSend[i].id.toString()]
        });
    }
    const response = await request(app.getHttpServer())
      .get('/chats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      chats: expect.arrayContaining([
        expect.objectContaining({ name: 'New chat 03' }),
        expect.objectContaining({ name: 'New chat 02' }),
        expect.objectContaining({ name: 'New chat 01' }),
        expect.objectContaining({ name: 'New chat' })
      ])
    });
  });
});
