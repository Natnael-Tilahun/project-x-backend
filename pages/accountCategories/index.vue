<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { AccountCategory } from "~/types";
import { columns as tableColumns } from "~/components/accountCategories/columns";
import { PermissionConstants } from "~/constants/permissions";
import { useAccountCategory } from "~/composables/useAccountCategory";
import ServerPagination from "~/components/ui/ServerPagination.vue"; // Add this line

const { 
  page, 
  size, 
  sort, 
  accountCategories: data, 
  total, 
  loading, 
  error: isError, 
  fetchAccountCategories: fetchData, 
  onPageChange, 
  onSizeChange, 
  onSortChange, 
  refreshAccountCategories, 
  getAccountCategoryByCode, 
} = useAccountCategory(); 
 
const keyword = ref<string>(""); 
 
// const searchHandler = async () => { 
//   try { 
//     data.value = [await getAccountCategoryByCode(keyword.value)]; 
//   } catch (err: any) { 
//     console.error("Error fetching account categories:", err); 
//     isError.value = true; 
//   } finally { 
//   } 
// }; 
 
const refreshAccountCategoriesHandler = async () => { 
  loading.value = true;
  try { 
    await refreshAccountCategories(); 
    await fetchData(); 
  } catch (err: any) { 
    console.error("Error refreshing account categories:", err); 
    isError.value = true; 
  } finally { 
    loading.value = false;
  } 
};

// Provide the fetchAccountCategories function for columns
provide('refetchAccountCategories', fetchData);

// Generate columns by passing the fetchAccountCategories function
const columns = computed(() => tableColumns(fetchData));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && data.length > 0 && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto overflow-y-auto"
  >
  <!-- <UiPermissionGuard :permission="PermissionConstants.CREATE_ACCOUNT_CATEGORY" > -->
      <UiButton :disabled="loading" class="w-fit self-end px-5" @click="refreshAccountCategoriesHandler"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Refresh
        Account Category</UiButton
      >
    <!-- </UiPermissionGuard> -->
    <UiDataTable :columns="columns" :data="data" @update:page="onPageChange" @update:page-size="onSizeChange">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <!-- <UiInput
              placeholder="Filter by service Name"
              :model-value="(table?.getColumn('serviceName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('serviceName')?.setFilterValue($event.target.value)
              "
            /> -->
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    <ServerPagination
      :page="page"
      :size="size"
      :total="total"
      :on-page-change="onPageChange"
      :on-size-change="onSizeChange"
    />
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
