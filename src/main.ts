import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { enable } from 'async-local-storage';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

async function setupSwager(app) {
  const swaggerOptions = new DocumentBuilder()
    .setTitle('TransFort')
    .setDescription('TransFort System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDocument);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: true });
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  enable();
  app.useGlobalPipes(new ValidationPipe());
  setupSwager(app);

  await app.listen(3000);
}
bootstrap();
