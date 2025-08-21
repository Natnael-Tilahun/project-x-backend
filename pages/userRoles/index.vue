<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Role } from "~/types";
import { columns as tableColumns } from "~/components/userRoles/columns";
import { PermissionConstants } from "~/constants/permissions";
import { useRoles } from "~/composables/useRoles"; // Import useRoles
import ServerPagination from "~/components/ui/ServerPagination.vue"; // Import ServerPagination

const {
  page,
  size,
  sort,
  systemRoles: data, // Renamed to data for existing template usage
  total,
  loading: isLoading, // Renamed to isLoading for existing template usage
  error: isError, // Renamed to isError for existing template usage
  fetchSystemRoles: fetchData, // Renamed to fetchData for existing template usage
  onPageChange,
  onSizeChange,
  onSortChange,
} = useRoles();

// Provide the fetchSystemRoles function for columns
provide('refetchSystemRoles', fetchData);

// Generate columns by passing the fetchSystemRoles function
const columns = computed(() => tableColumns(fetchData));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard :permission=PermissionConstants.CREATE_ROLE >
    <NuxtLink to="/userRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New
        Role</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data" @update:page="onPageChange" @update:page-size="onSizeChange">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Role Name"
              :model-value="(table?.getColumn('name')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('name')?.setFilterValue($event.target.value)
              "
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
