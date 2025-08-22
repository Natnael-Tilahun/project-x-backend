<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/merchants/transactions/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const route = useRoute();
const fullPath = ref(route.path);
const merchantId = ref<string>("");
merchantId.value = getIdFromPath();

const {
      page,
  size,
  sort,
  merchantOperators: data,
  total,
  loading: isLoading,
  error: isError,
  fetchMerchantOperators: fetchData,
      onPageChange,
  onSizeChange,
  onSortChange,
    } = useMerchantTransactions(merchantId);


// Provide the refetch function
provide("refetchMerchantTransactions", fetchData);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchData));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard
      :permission="PermissionConstants.CREATE_STAFF_ASSIGNMENT"
    >
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }"> </template>
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
