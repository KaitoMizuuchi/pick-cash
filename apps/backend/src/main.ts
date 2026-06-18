import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全Controller共通でGlobalExceptionFilterを適用。useGlobalFilters はDIを介さず手動 new するパターン。
  // Filterが他のService（PrismaService等）に依存しないため、このシンプルな登録方法で十分。
  app.useGlobalFilters(new GlobalExceptionFilter());
  // nestjs-zod の Pipe をグローバル登録すると、@Body() / @Query() / @Param() で受けた
  // createZodDto 由来の DTO が自動でバリデーションされ、不正値は 400 (ZodValidationException) に変換される。
  // GlobalExceptionFilter 側で 400 → 'Bad Request' に整形されるため、レスポンスは情報漏洩しない。
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(3001);
}

bootstrap();
