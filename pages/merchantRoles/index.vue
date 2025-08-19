<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Role } from "~/types";
import { columns as tableColumns } from "~/components/merchantRoles/columns";
import { PermissionConstants } from "~/constants/permissions";
import { useMerchantRoles } from "~/composables/useMerchantRoles"; // Import useMerchantRoles
import ServerPagination from "~/components/ui/ServerPagination.vue"; // Import ServerPagination

const {
  page,
  size,
  sort,
  merchantOperatorRoles: data, // Renamed to data for existing template usage
  total,
  loading: isLoading, // Renamed to isLoading for existing template usage
  error: isError, // Renamed to isError for existing template usage
  fetchMerchantOperatorRoles: fetchData, // Renamed to fetchData for existing template usage
  onPageChange,
  onSizeChange,
  onSortChange,
} = useMerchantRoles();

// Provide the fetchMerchantOperatorRoles function for columns
provide('refetchMerchantRoles', fetchData);

// Generate columns by passing the fetchMerchantOperatorRoles function
const columns = computed(() => tableColumns(fetchData));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && data.length > 0 && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard :permission=PermissionConstants.CREATE_MERCHANT_OPERATOR_ROLE >
    <NuxtLink to="/merchantRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New Merchant Operator
        Role</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
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

  <!-- <div v-else-if="data && !isError ">
    <UiNoResultFound title="Sorry, No role found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
