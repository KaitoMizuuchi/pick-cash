import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全Controller共通でGlobalExceptionFilterを適用。useGlobalFilters はDIを介さず手動 new するパターン。
  // Filterが他のService（PrismaService等）に依存しないため、このシンプルな登録方法で十分。
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3001);
}

bootstrap();
