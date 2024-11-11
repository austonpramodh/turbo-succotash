import { RequestMethod, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { otelSDK } from "@turbo-succotash-libs/observability";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  await otelSDK.start();
  // eslint-disable-next-line no-console
  console.log("Started OTEL SDK");

  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.enableShutdownHooks();
  app.enableCors({ origin: "*" });

  app.setGlobalPrefix("api", {
    exclude: [{ path: "docs", method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle("Todos Example")
    .setDescription("The todo API description")
    .setVersion("1.0")
    .addTag("todo")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  await app.listen(3000);
}
bootstrap();
