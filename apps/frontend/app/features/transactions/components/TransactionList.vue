<script setup lang="ts">
import type { TransactionListItem } from '../composables/useTransactions'

// formatDate / formatAmount は app/utils/format.ts に切り出してあり、
// Nuxt の自動インポート対象（imports.dirs に utils が含まれる）なので import 不要で使える。
// error は親で取得失敗を受け取って渡してもらう。空表示の文言を「取得失敗」と「データ無し」で
// 切り替えるため。値の中身までは使わず、有無だけを表示判定に使う。
defineProps<{
  transactions: TransactionListItem[]
  error?: Error | null
}>()
</script>

<template>
  <ul class="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
    <li
      v-for="tx in transactions"
      :key="tx.id"
      class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-50"
    >
      <!-- 日付: 視線の起点なので最左、固定幅で揃える -->
      <div class="w-12 shrink-0 font-mono text-xs font-medium text-slate-500 tabular-nums">
        {{ formatDate(tx.date) }}
      </div>

      <!-- カテゴリ + メモ: 中央に最大幅、はみ出しは省略 -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <span class="truncate text-sm font-medium text-slate-900">
            {{ tx.category.name }}
          </span>
          <!-- 固定費バッジ: アクセント色は使わず控えめなニュートラルでさりげなく -->
          <span
            v-if="tx.isFixed"
            class="inline-flex shrink-0 items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
          >
            固定
          </span>
        </div>
        <!-- memo は v-if で出し分けると有無で高さが揃わなくなるため、常に表示して
             空のときは "—" でプレースホルダ表記する。色は薄めで存在感を抑える。 -->
        <p class="mt-0.5 truncate text-xs text-slate-400">
          {{ tx.memo || '—' }}
        </p>
      </div>

      <!-- 金額: 収入は blue-600 で「プラス」、支出は red-600 で「マイナス」を明示。
           プラス/マイナス符号と色の両方で視覚的に強調する。tabular-nums で桁を揃える。 -->
      <div
        class="shrink-0 font-mono text-sm font-semibold tabular-nums"
        :class="tx.type === 'income' ? 'text-blue-600' : 'text-red-600'"
      >
        {{ tx.type === 'income' ? '+' : '-' }}{{ formatAmount(tx.amount) }}
      </div>
    </li>

    <!-- 空状態: リストが空でも枠だけ残る形にして、画面が崩れないようにする。
         取得が失敗した場合（error あり）と本当に0件の場合で文言を切り替える。
         取得失敗時の詳細はトースト側に出るため、ここでは短い文言にとどめる。 -->
    <li
      v-if="transactions.length === 0"
      class="px-4 py-10 text-center text-sm text-slate-500"
    >
      {{ error ? 'エラーが発生しました' : '取引がまだ登録されていません' }}
    </li>
  </ul>
</template>
