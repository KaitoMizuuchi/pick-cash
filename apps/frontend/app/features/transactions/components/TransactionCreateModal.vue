<script setup lang="ts">
import type { CreateTransactionInput } from '@pick-cash/shared';
import { createTransactionSchema } from '@pick-cash/shared';
import type { FormSubmitEvent } from '#ui/types';

const open = defineModel<boolean>('open', { required: true });

const { create } = useTransactions();
const { categories, fetchCategories } = useCategories();

const TYPE_ITEMS = [
  { label: '支出', value: 'expense' as const },
  { label: '収入', value: 'income' as const },
];

const categoryItems = computed(() =>
  categories.value.map((c) => ({ label: c.name, value: c.id })),
);

const today = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getInitialState = () => ({
  type: 'expense' as const,
  categoryId: '',
  amount: undefined as number | undefined,
  date: today(),
  memo: '',
  isFixed: false,
});

const state = reactive(getInitialState());

watch(open, (isOpen) => {
  if (isOpen) {
    Object.assign(state, getInitialState());
    fetchCategories(state.type);
  }
});

watch(
  () => state.type,
  () => {
    state.categoryId = '';
    fetchCategories(state.type);
  },
);

const onSubmit = async (event: FormSubmitEvent<CreateTransactionInput>) => {
  const data = { ...event.data, memo: event.data.memo || null };
  const success = await create(data);
  if (success) {
    open.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="open" title="取引を登録">
    <template #body>
      <UForm :schema="createTransactionSchema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="種別" name="type">
          <URadioGroup v-model="state.type" :items="TYPE_ITEMS" orientation="horizontal" />
        </UFormField>

        <UFormField label="カテゴリ" name="categoryId">
          <USelect v-model="state.categoryId" :items="categoryItems" placeholder="カテゴリを選択" />
        </UFormField>

        <UFormField label="金額" name="amount">
          <UInput v-model.number="state.amount" type="number" placeholder="1000" />
        </UFormField>

        <UFormField label="日付" name="date">
          <UInput v-model="state.date" type="date" />
        </UFormField>

        <UFormField label="メモ" name="memo">
          <UTextarea v-model="state.memo" placeholder="任意" />
        </UFormField>

        <UCheckbox v-model="state.isFixed" label="固定費" />

        <div class="flex justify-end gap-2 pt-2">
          <UButton variant="ghost" label="キャンセル" @click="open = false" />
          <UButton type="submit" label="登録" loading-auto />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
