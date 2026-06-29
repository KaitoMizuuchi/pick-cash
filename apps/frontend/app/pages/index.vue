<script setup lang="ts">
// 一覧画面のエントリポイント。
// composable から状態と取得関数を受け取り、マウント時に取得を発火する。
const { transactions, isLoading, error, fetchAll } = useTransactions()

// React の useEffect(() => { fetchAll() }, []) と同じ役割。
// ページがマウントされたタイミングで一度だけ一覧を取得する。
onMounted(() => {
  fetchAll()
})
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <header class="mb-6 flex items-baseline justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">取引履歴</h1>
        <p class="mt-1 text-xs text-slate-500">backend から取得した取引を時系列で表示します</p>
      </div>
      <span class="font-mono text-xs text-slate-500 tabular-nums">
        {{ transactions.length }}件
      </span>
    </header>

    <!-- ローディング: 取得中は枠だけ表示してレイアウト崩れを避ける -->
    <div
      v-if="isLoading"
      class="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500"
    >
      読み込み中...
    </div>

    <!-- エラー: 暫定実装。Step 1-4 で useToast による通知に置き換える -->
    <div
      v-else-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      取得に失敗しました: {{ error.message }}
    </div>

    <!-- 一覧: features/transactions/components/TransactionList.vue が自動 import される -->
    <TransactionList v-else :transactions="transactions" />
  </div>
</template>
