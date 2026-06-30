// Transaction の状態管理と API 操作を提供する composable。
// $fetch で backend を叩き、ref で状態管理する。

import type { CreateTransactionInput } from '@pick-cash/shared';

// API レスポンス型（backend の transactionSelect に対応）。
// shared の Transaction 型は categoryId/userId だけだが、API は category/user をネストして返すため
// 専用の型を持つ。将来共有が必要になったら shared に切り出す。
export type TransactionListItem = {
  id: string;
  amount: number;
  date: string;
  memo: string | null;
  type: 'income' | 'expense';
  isFixed: boolean;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  user: { id: string; name: string };
};

type TransactionsResponse = {
  data: TransactionListItem[];
};

// モジュールスコープで状態を共有（楽観的更新のため）
const _transactions = ref<TransactionListItem[]>([]);
const _isLoading = ref(false);
const _error = ref<Error | null>(null);

export const useTransactions = () => {
  const config = useRuntimeConfig();
  // Nuxt UI v4 が提供する useToast() を利用する。<UApp> がトースト表示器を内蔵しているため
  // 自前で Container を置く必要はない。await 後の context 外し対策として composable の
  // トップで取得しておく。
  const toast = useToast();

  const fetchAll = async () => {
    _isLoading.value = true;
    _error.value = null;
    try {
      const response = await $fetch<TransactionsResponse>('/transactions', {
        baseURL: config.public.apiBase,
      });
      _transactions.value = response.data;
    } catch (e) {
      // $fetch は 4xx/5xx で reject するため、ここに HTTP エラーと通信失敗の両方が来る。
      // 表示メッセージは getErrorDescription (utils/apiError.ts) に委譲。
      // backend の汎用文言を再利用し、フロント側でステータス別の分岐は持たない（二重管理回避）。
      _error.value = e instanceof Error ? e : new Error(String(e));
      toast.add({
        title: '取得に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
    } finally {
      _isLoading.value = false;
    }
  };

  const create = async (input: CreateTransactionInput): Promise<boolean> => {
    try {
      const created = await $fetch<TransactionListItem>('/transactions', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: input,
      });
      _transactions.value.unshift(created);
      toast.add({
        title: '取引を登録しました',
        color: 'success',
        icon: 'i-lucide-circle-check',
      });
      return true;
    } catch (e) {
      toast.add({
        title: '登録に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
      return false;
    }
  };

  const update = async (id: string, input: CreateTransactionInput): Promise<boolean> => {
    try {
      const updated = await $fetch<TransactionListItem>(`/transactions/${id}`, {
        method: 'PATCH',
        baseURL: config.public.apiBase,
        body: input,
      });
      const index = _transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        _transactions.value[index] = updated;
      }
      toast.add({
        title: '取引を更新しました',
        color: 'success',
        icon: 'i-lucide-circle-check',
      });
      return true;
    } catch (e) {
      toast.add({
        title: '更新に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/transactions/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBase,
      });
      _transactions.value = _transactions.value.filter((t) => t.id !== id);
      toast.add({
        title: '取引を削除しました',
        color: 'success',
        icon: 'i-lucide-circle-check',
      });
      return true;
    } catch (e) {
      toast.add({
        title: '削除に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
      return false;
    }
  };

  return {
    transactions: _transactions,
    isLoading: _isLoading,
    error: _error,
    fetchAll,
    create,
    update,
    remove,
  };
};
