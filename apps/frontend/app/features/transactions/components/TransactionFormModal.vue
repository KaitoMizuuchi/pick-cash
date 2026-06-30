<script setup lang="ts">
import type { CreateTransactionInput } from "@pick-cash/shared";
import { createTransactionSchema } from "@pick-cash/shared";
import type { FormSubmitEvent } from "#ui/types";
import type { TransactionListItem } from "../composables/useTransactions";
import { TYPE_ITEMS } from "../constants";

const props = defineProps<{
  mode: "create" | "edit";
  transaction?: TransactionListItem;
}>();

const open = defineModel<boolean>("open", { required: true });

const { create, update } = useTransactions();
const { categoryItems, fetchCategories } = useCategories();

const title = computed(() =>
  props.mode === "create" ? "取引を登録" : "取引を編集",
);
const submitLabel = computed(() => (props.mode === "create" ? "登録" : "更新"));

const getInitialState = () => {
  if (props.mode === "edit" && props.transaction) {
    return {
      type: props.transaction.type,
      categoryId: props.transaction.category.id,
      amount: props.transaction.amount as number | undefined,
      date: props.transaction.date.slice(0, 10),
      memo: props.transaction.memo ?? "",
      isFixed: props.transaction.isFixed,
    };
  }
  return {
    type: "expense" as const,
    categoryId: "",
    amount: undefined as number | undefined,
    date: today(),
    memo: "",
    isFixed: false,
  };
};

const state = reactive(getInitialState());

watch(open, (isOpen) => {
  if (isOpen) {
    Object.assign(state, getInitialState());
    fetchCategories(state.type);
  }
});

// watch ではなくイベントハンドラで種別変更を検知する。
// watch だと Object.assign での初期化時にも発火してしまい、
// 編集モードで既存の categoryId がリセットされる問題がある。
const onTypeChange = (type: string) => {
  state.categoryId = "";
  fetchCategories(type as "income" | "expense");
};

const onSubmit = async (event: FormSubmitEvent<CreateTransactionInput>) => {
  const data = { ...event.data, memo: event.data.memo || null };
  const success =
    props.mode === "create"
      ? await create(data)
      : await update(props.transaction!.id, data);
  if (success) {
    open.value = false;
  }
};
</script>

<template>
  <UModal v-model:open="open" :title="title">
    <template #body>
      <UForm
        :schema="createTransactionSchema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="種別" name="type">
          <URadioGroup
            v-model="state.type"
            :items="TYPE_ITEMS"
            orientation="horizontal"
            @update:model-value="onTypeChange"
          />
        </UFormField>

        <UFormField label="カテゴリ" name="categoryId">
          <USelect
            v-model="state.categoryId"
            :items="categoryItems"
            placeholder="カテゴリを選択"
          />
        </UFormField>

        <UFormField label="金額" name="amount">
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="1000"
          />
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
          <UButton type="submit" :label="submitLabel" loading-auto />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
