import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

// MVP段階では認証を仮実装としseedで投入したユーザーをそのまま利用する。
// 本実装（Better Auth等）導入時にこのMiddlewareを差し替える。
const DEV_USER_ID = 'seed_user_dev';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.userId = DEV_USER_ID;
    next();
  }
}
