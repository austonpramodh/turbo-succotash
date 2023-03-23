import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino/Logger';

import otelSDK from './tracing';
import { AppModule } from './app.module';
import { DelayInterceptor } from './delay.interceptor';

async function bootstrap(): Promise<void> {
  // Start SDK before nestjs factory create
  await otelSDK.start();

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'docs', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('Todos Example')
    .setDescription('The todo API description')
    .setVersion('1.0')
    .addTag('todo')
    .build();
  // http://172.31.237.201:9464/metrics

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

  app.useGlobalInterceptors(new DelayInterceptor(3000));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port, () => {
    const logger = new Logger('Main');

    logger.log(`Listening on port: ${port}`);
  });
}
bootstrap();
