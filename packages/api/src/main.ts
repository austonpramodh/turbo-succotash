import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino/Logger';

import { AppModule } from './app.module';
import { DelayInterceptor } from './delay.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'docs', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Todos Example')
    .setDescription('The todo API description')
    .setVersion('1.0')
    .addTag('todo')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalInterceptors(new DelayInterceptor(0));

  await app.listen(3002);
}
bootstrap();
