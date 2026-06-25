<script setup lang="ts">
// shared パッケージから型を import できることを確認するためのサンプル。
// Step 3 (shared 依存追加) の動作確認用。次の STEP で features ディレクトリと
// 自動インポート設定を入れる際に、このサンプル表示は削除する想定。
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
    <p style="padding: 16px; background: #f0f0f0; margin-top: 16px;">
      shared 動作確認: {{ sampleCategory.name }} ({{ sampleCategory.type }})
    </p>
  </div>
</template>
