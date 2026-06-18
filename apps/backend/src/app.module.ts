import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { CategoriesModule } from './modules/categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [AppController],
})
// NestModule を implements することで、NestJSが起動時に configure() を呼んでMiddleware設定を読み込む。
// （メソッド名のtypo防止と、引数の MiddlewareConsumer の型推論を効かせる目的）
export class AppModule implements NestModule {
  // Middlewareの適用設定。リクエストがControllerに到達する前にここで指定したMiddlewareが順に実行される。
  configure(consumer: MiddlewareConsumer): void {
    // forRoutes('*') で全パスに AuthMiddleware を適用。
    // 将来 /auth/login のような公開エンドポイントが必要になったら .exclude(...) で除外する。
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
