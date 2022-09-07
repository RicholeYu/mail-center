import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import init from './init';

async function bootstrap() {
  await init();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
