<script setup lang="ts">
// 一覧画面のエントリポイント。
// composable から状態と取得関数を受け取り、マウント時に取得を発火する。
// 取得失敗の詳細通知はトーストで行うが、リストの空状態文言を切り替えるため error も
// 受け取って TransactionList に渡す。
const { transactions, isLoading, error, fetchAll } = useTransactions();

// React の useEffect(() => { fetchAll() }, []) と同じ役割。
// ページがマウントされたタイミングで一度だけ一覧を取得する。
onMounted(() => {
  fetchAll();
});

const isCreateModalOpen = ref(false);
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <header class="mb-6 flex items-baseline justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-900">取引履歴</h1>
        <p class="mt-1 text-xs text-slate-500">backend から取得した取引を時系列で表示します</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-mono text-xs text-slate-500 tabular-nums">
          {{ transactions.length }}件
        </span>
        <UButton label="新規登録" icon="i-lucide-plus" @click="isCreateModalOpen = true" />
      </div>
    </header>

    <!-- ローディング: 取得中は枠だけ表示してレイアウト崩れを避ける -->
    <div
      v-if="isLoading"
      class="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500"
    >
      読み込み中...
    </div>

    <!-- 一覧: features/transactions/components/TransactionList.vue が自動 import される。
         取得失敗時の詳細通知はトーストに任せ、ここでは error を渡して空状態の文言だけ
         切り替える（「取引がまだ登録されていません」⇔「エラーが発生しました」）。 -->
    <TransactionList v-else :transactions="transactions" :error="error" />

    <TransactionCreateModal v-model:open="isCreateModalOpen" />
  </div>
</template>
