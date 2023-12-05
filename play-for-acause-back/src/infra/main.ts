import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true
  });
  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials'
    ],
    credentials: true
  };
  app.enableShutdownHooks();
  app.enableCors(corsOptions);
  const config = new DocumentBuilder()
    .setTitle('ChatPlay')
    .setDescription('The ChatPlay api')
    .setVersion('1.0')
    .addTag('ChatPlay')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();
  const swaggerOptions = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          value: ''
        }
      }
    }
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerOptions);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
