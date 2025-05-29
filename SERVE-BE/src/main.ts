import { webcrypto } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServeExceptionFilter } from './common/exception/serve-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API di autenticazione')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServeExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGIN as string,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
