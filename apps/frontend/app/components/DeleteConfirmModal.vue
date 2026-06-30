<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <UModal v-model:open="open" title="取引の削除">
    <template #body>
      <p class="text-sm text-slate-600">この取引を削除してもよろしいですか？</p>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="キャンセル" @click="open = false" />
        <UButton color="error" label="削除" @click="emit('confirm')" />
      </div>
    </template>
  </UModal>
</template>
