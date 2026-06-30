type CategoryItem = {
  id: string;
  name: string;
  type: 'income' | 'expense';
};

type CategoriesResponse = {
  data: CategoryItem[];
};

export const useCategories = () => {
  const config = useRuntimeConfig();
  const toast = useToast();
  const categories = ref<CategoryItem[]>([]);

  const fetchCategories = async (type?: 'income' | 'expense') => {
    try {
      const response = await $fetch<CategoriesResponse>('/categories', {
        baseURL: config.public.apiBase,
        params: type ? { type } : {},
      });
      categories.value = response.data;
    } catch (e) {
      toast.add({
        title: 'カテゴリの取得に失敗しました',
        description: getErrorDescription(e),
        color: 'error',
        icon: 'i-lucide-circle-x',
      });
    }
  };

  const categoryItems = computed(() =>
    categories.value.map((c) => ({ label: c.name, value: c.id })),
  );

  return { categories, categoryItems, fetchCategories };
};
