<script setup lang="ts">
// shared パッケージから型を import できることを確認するためのサンプル。
// Step 3 (shared 依存追加) と Step 5 (Tailwind v4 導入) の動作確認用。
// 次の STEP で features ディレクトリを切り出す際にこのサンプル表示は削除する想定。
import type { Category, TransactionType } from '@pick-cash/shared'

const sampleCategory: Category = {
  id: 'sample',
  name: 'サンプル',
  type: 'expense' as TransactionType,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
    <!-- Tailwind v4 の動作確認用ブロック。淡色のカードとして表示する。 -->
    <div class="mx-auto mt-6 max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          ✓
        </span>
        <p class="text-base font-semibold text-slate-900">Tailwind v4 動作確認</p>
      </div>
      <p class="mt-3 text-sm text-slate-600">
        shared から取得した型:
        <span class="font-medium text-slate-900">{{ sampleCategory.name }}</span>
        <span class="ml-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
          {{ sampleCategory.type }}
        </span>
      </p>
    </div>
  </div>
</template>
