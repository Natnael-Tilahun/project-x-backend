import { ref, reactive } from 'vue';
import { useApi } from './useApi';

export function usePagination<T>(endpoint: string, options?: { autoFetch?: boolean }) {
  const autoFetch = options?.autoFetch ?? true;
  const page = ref(1);
  const size = ref(20); // Reset to default 10
  const sort = ref('id,desc');
  const search = ref(''); // New search ref
  const data = ref<T[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<any>(null);

  const fetchData = async () => {
    loading.value = true;
    console.log(`Fetching data from: ${endpoint}`);
    console.log(`Parameters: page=${page.value - 1}, size=${size.value}, sort=${sort.value}, search=${search.value}`); // Log search
    try {
      const params: any = {
        page: page.value - 1,
        size: size.value,
        // sort: sort.value, // Ensure sort is included
      };
      if (search.value) {
        params.keyword = search.value; // Assuming 'keyword' is the search parameter name
      }

      const response = await useApi().fetch(endpoint, { // Use .fetch as per current file
        params: params,
      });

      const totalStr = response.headers?.get && response.headers.get('x-total-count');
      data.value = response.data.value as unknown as T[]; // Align with existing data assignment
      total.value = parseInt(totalStr || '0', 10);
    } catch (e) {
      error.value = e;
      console.error('API Error:', e);
    }
    finally {
      loading.value = false;
    }
  };

  const onPageChange = (newPage: number) => {
    page.value = newPage;
    fetchData();
  };

  const onSizeChange = (newSize: number) => {
    size.value = newSize;
    fetchData();
  };

  const onSortChange = (newSort: string) => {
    sort.value = newSort;
    fetchData();
  };

  const onSearchChange = (newSearch: string) => { // New search handler
    search.value = newSearch;
    page.value = 1; // Reset to first page on new search
    fetchData();
  };

  if (autoFetch) {
    fetchData();
  }

  return {
    page,
    size,
    sort,
    search, // Return search ref
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
    onSearchChange, // Return search handler
  };
}