import { FetchError } from 'ofetch';

// API エラーをユーザー向けの表示文字列に変換する共通ヘルパ。
// - HTTP エラー（FetchError）の場合は backend が返した message をそのまま使う
//   （二重管理を避けるため、frontend ではステータス別の文言を持たない方針）。
// - それ以外（ネットワーク到達失敗、CORS で reject など）は固定メッセージを返す。
export const getErrorDescription = (e: unknown): string => {
  if (e instanceof FetchError && typeof e.data?.message === 'string') {
    return e.data.message;
  }
  return 'サーバーに接続できませんでした。ネットワークをご確認ください。';
};
