// Transaction 一覧取得用の composable。
// $fetch で backend を叩き、ref で状態管理する。
// 状態は呼び出し側ごとに独立（グローバル共有が必要になったら useState への切替を検討）。

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

export const useTransactions = () => {
  const config = useRuntimeConfig();
  // Nuxt UI v4 が提供する useToast() を利用する。<UApp> がトースト表示器を内蔵しているため
  // 自前で Container を置く必要はない。await 後の context 外し対策として composable の
  // トップで取得しておく。
  const toast = useToast();
  const transactions = ref<TransactionListItem[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  // 一覧取得。loading / error 状態をリアクティブに反映する。
  // 呼び出し側は finally でなく isLoading.value を監視する想定。
  const fetchAll = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<TransactionsResponse>('/transactions', {
        baseURL: config.public.apiBase,
      });
      transactions.value = response.data;
    } catch (e) {
      // $fetch は 4xx/5xx で reject するため、ここに HTTP エラーと通信失敗の両方が来る。
      // 表示メッセージは getErrorDescription (utils/apiError.ts) に委譲。
      // backend の汎用文言を再利用し、フロント側でステータス別の分岐は持たない（二重管理回避）。
      error.value = e instanceof Error ? e : new Error(String(e));
      toast.add({
        title: '取得に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
    } finally {
      isLoading.value = false;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    fetchAll,
  };
};
