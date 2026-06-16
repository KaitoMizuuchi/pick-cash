import { type ArgumentsHost, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalExceptionFilter } from './globalException.filter';

// ArgumentsHost のうち、Filter が使うメソッドだけをモックする最小限のヘルパー。
const createHost = (response: Response): ArgumentsHost =>
  ({
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  }) as unknown as ArgumentsHost;

const createResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
};

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    // 詳細ログは標準で console.error に出すが、テスト出力を汚さないようスパイで握る。
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('HttpExceptionは元のステータスコードと汎用メッセージで返す', () => {
    const response = createResponse();
    filter.catch(new NotFoundException('内部の詳細'), createHost(response));

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  it('未定義ステータスのHttpExceptionは500扱いの汎用メッセージで返す', () => {
    const response = createResponse();
    // 418 はマッピングテーブルに未定義
    filter.catch(new HttpException('teapot', 418), createHost(response));

    expect(response.status).toHaveBeenCalledWith(418);
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('HttpException以外の例外は500 + Internal Server Errorで返す', () => {
    const response = createResponse();
    filter.catch(new Error('想定外の例外'), createHost(response));

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('例外の詳細はconsole.errorに出力される', () => {
    const response = createResponse();
    const error = new Error('debug用メッセージ');
    filter.catch(error, createHost(response));

    expect(consoleErrorSpy).toHaveBeenCalledWith('[GlobalExceptionFilter]', error);
  });
});
