<script setup lang="ts">
// Nuxt UI v4 を有効化するには、ルートを <UApp> でラップする必要がある。
// グローバルトーストやモーダルの土台もここで提供される。
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <!-- トースト表示器は <UApp> が内蔵で提供する。useToast() で通知を積めば自動で右上に出る。 -->
  </UApp>
</template>
