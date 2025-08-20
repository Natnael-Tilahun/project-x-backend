<script setup lang="ts">
import { columns as tableColumns } from "~/components/userPermissions/columns";
import { usePermissions } from "~/composables/usePermissions";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const {
  page,
  size,
  sort,
  permissions: data,
  total,
  loading: isLoading,
  error: isError,
  fetchPermissions: fetchData,
  onPageChange,
  onSizeChange,
  onSortChange,
} = usePermissions();

// Provide refetch function for columns
provide('refetchPermissions', fetchData);
const columns = computed(() => tableColumns(fetchData));
</script>
<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div v-else-if="data && data.length > 0 && !isError" class="py-4 flex flex-col space-y-10 mx-auto">
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Code"
              :model-value="(table?.getColumn('code')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="table?.getColumn('code')?.setFilterValue($event.target.value)"
            />
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
  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>

<style lang="postcss" scoped></style>
