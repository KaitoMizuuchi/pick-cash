// Express の Request に userId を生やすための型拡張。
// 認証ミドルウェアがリクエストごとに注入する。
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export {};
