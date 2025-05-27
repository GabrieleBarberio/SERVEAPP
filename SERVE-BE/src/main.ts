import { webcrypto } from 'crypto'; // ✅ Import ES-style e tipizzato
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  configurable: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
