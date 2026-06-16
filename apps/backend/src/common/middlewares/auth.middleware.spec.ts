import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
  it('リクエストに仮ユーザーIDを注入してnextを呼ぶ', () => {
    const middleware = new AuthMiddleware();
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn();

    middleware.use(req, res, next);

    expect(req.userId).toBe('seed_user_dev');
    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith();
  });
});
