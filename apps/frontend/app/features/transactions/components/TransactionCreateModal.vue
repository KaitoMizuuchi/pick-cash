<script setup lang="ts">
import type { CreateTransactionInput } from '@pick-cash/shared';
import { createTransactionSchema } from '@pick-cash/shared';
import type { FormSubmitEvent } from '#ui/types';
import { TYPE_ITEMS } from '../constants';

// defineModel: 親の v-model:open を受け取り、読み書き可能な ref として扱う。
// React の props + onChange コールバックを1つの変数にまとめたもの。
// open.value = false とするだけで親の isCreateModalOpen も更新される。
const open = defineModel<boolean>('open', { required: true });

const { create } = useTransactions();
const { categoryItems, fetchCategories } = useCategories();

const getInitialState = () => ({
  type: 'expense' as const,
  categoryId: '',
  amount: undefined as number | undefined,
  date: today(),
  memo: '',
  isFixed: false,
});

// reactive: オブジェクト全体をリアクティブにする（ref と違い .value 不要でプロパティに直接アクセス）。
// セットアップ時に1回だけ生成され、モーダルの開閉で消えない。
const state = reactive(getInitialState());

// watch: useEffect の依存配列に近い。open が変わるたびにコールバックが発火する。
// 第1引数 isOpen には open の「新しい値」が入る。
watch(open, (isOpen) => {
  if (isOpen) {
    // Object.assign で既存オブジェクトのプロパティだけ上書きする。
    // state = reactive(getInitialState()) と再代入するとリアクティブの繋がりが切れるため。
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

// UForm の @submit は Zod バリデーション通過後にだけ発火する。
// event.data にはスキーマでパース済みの値が入る。
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
