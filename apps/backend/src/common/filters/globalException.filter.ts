import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { Prisma } from "../../generated/prisma/client";

// ステータスコードに対する汎用メッセージ。クライアントには詳細を返さず、ここに定義した文言のみを返す。
// 詳細（スタックトレース・原因等）は console.error にのみ出力する方針（docs/architecture.md 参照）。
const DEFAULT_MESSAGES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: "Bad Request",
  [HttpStatus.UNAUTHORIZED]: "Unauthorized",
  [HttpStatus.FORBIDDEN]: "Forbidden",
  [HttpStatus.NOT_FOUND]: "Not Found",
  [HttpStatus.CONFLICT]: "Conflict",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
};

const INTERNAL_ERROR_MESSAGE = "Internal Server Error";

// @Catch() に何も指定しないと「すべての例外」を捕捉する（HttpExceptionだけでなく、Prismaエラーや
// 通常のError等もここに来る）。NestJSのデフォルトExceptionFilterを置き換える形で使う。
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // 第1引数は unknown 想定（HttpException 以外も来るため）。
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    // 詳細はサーバーログにのみ出力。スタックトレース付きで残すことで原因調査を可能にする。
    console.error("[GlobalExceptionFilter]", exception);

    // Prismaのエラーマッピング
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // データが存在しないときのエラー
      if (exception.code === "P2025") {
        response.status(HttpStatus.NOT_FOUND).json({
          message:
            DEFAULT_MESSAGES[HttpStatus.NOT_FOUND] ?? INTERNAL_ERROR_MESSAGE,
        });
        return;
      }

      // 一意制約違反のエラー
      if (exception.code === "P2002") {
        response.status(HttpStatus.CONFLICT).json({
          message:
            DEFAULT_MESSAGES[HttpStatus.CONFLICT] ?? INTERNAL_ERROR_MESSAGE,
        });
        return;
      }

      // 外部キー制約違反のエラー
      if (exception.code === "P2003") {
        response.status(HttpStatus.BAD_REQUEST).json({
          message:
            DEFAULT_MESSAGES[HttpStatus.BAD_REQUEST] ?? INTERNAL_ERROR_MESSAGE,
        });
        return;
      }

      // リレーション制約違反のエラー
      if (exception.code === "P2004") {
        response.status(HttpStatus.BAD_REQUEST).json({
          message:
            DEFAULT_MESSAGES[HttpStatus.BAD_REQUEST] ?? INTERNAL_ERROR_MESSAGE,
        });
        return;
      }
    }

    // NestJS標準・nestjs-zod のバリデーション例外などはここに分類される（HttpExceptionを継承）。
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        message: DEFAULT_MESSAGES[status] ?? INTERNAL_ERROR_MESSAGE,
      });
      return;
    }

    // 想定外の例外は一律 500 として汎用メッセージのみを返す。情報漏洩を防ぐため詳細はレスポンスに含めない。
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: INTERNAL_ERROR_MESSAGE,
    });
  }
}
