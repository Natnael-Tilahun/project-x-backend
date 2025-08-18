<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { AccountCategory } from "~/types";
import { columns as tableColumns } from "~/components/accountCategories/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getAccountCategories, getAccountCategoryByCode, refreshAccountCategories, isLoading } = useAccountCategory();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<AccountCategory[]>([]);
const keyword = ref<string>("");

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const accountCategories = await getAccountCategories(0, 100000000);
    data.value = accountCategories;
  } catch (err: any) {
    console.error("Error fetching account categories:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("accountCategoriesData", async () => {
  await fetchData();
});

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getAccountCategoryByCode(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching account categories:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refreshAccountCategoriesHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    await refreshAccountCategories();
    await fetchData();
  } catch (err: any) {
    console.error("Error refreshing account categories:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

// Provide the refetch function
provide('refetchAccountCategories', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
  <!-- <UiPermissionGuard :permission="PermissionConstants.CREATE_ACCOUNT_CATEGORY" > -->
      <UiButton :disabled="loading" class="w-fit self-end px-5" @click="refreshAccountCategoriesHandler"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Refresh
        Account Category</UiButton
      >
    <!-- </UiPermissionGuard> -->
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by service Name"
              :model-value="(table?.getColumn('serviceName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('serviceName')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
