import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // frontend (Nuxt) からのクロスオリジンリクエストを許可する。
  // NestJS は CORS が初期状態で無効なので明示する必要がある。
  // 開発時は localhost:3000 のみ許可、将来本番URLが決まったら配列に追加する。
  // credentials: true は Cookie ベース認証導入時を見据えた設定。
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
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
