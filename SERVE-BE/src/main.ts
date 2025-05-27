
import { webcrypto } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServeExceptionFilter } from './common/exception/serve-exception.filter';

Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServeExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
