<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Customer } from "~/types";
import { columns as tableColumns } from "~/components/customers/columns";
import { PermissionConstants } from "~/constants/permissions";
import { useCustomers } from "~/composables/useCustomers"; // Import useCustomers
import ServerPagination from "~/components/ui/ServerPagination.vue"; // Import ServerPagination

const {
  page,
  size,
  sort,
  customers: data, // Renamed to data for existing template usage
  total,
  loading: isLoading, // Renamed to isLoading for existing template usage
  error: isError, // Renamed to isError for existing template usage
  fetchCustomers: fetchData, // Renamed to fetchData for existing template usage
  onPageChange,
  onSizeChange,
  onSortChange,
  searchCustomers
} = useCustomers();

const keyword = ref<string>("");
const loading = ref(isLoading.value);

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    if (keyword.value && keyword.value.trim().length > 0) {
      data.value = await searchCustomers(keyword.value.trim());
    } else {
      data.value = [] as any;
    }
  } catch (err: any) {
    console.error("Error fetching customers:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

// Provide the fetchCustomers function for columns
provide('refetchCustomers', fetchData);

// Generate columns by passing the fetchCustomers function
const columns = computed(() => tableColumns(fetchData));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div>
    <div class="w-full flex justify-between">
      <div class="flex items-center gap-4">
        <UiInput
          type="search"
          placeholder="Search by customer id, name or phone (start from 9)"
          class="md:w-[200px] lg:w-[400px] placeholder:text-sm"
          v-model="keyword"
          @keyup.enter="searchHandler"
        />
        <UiButton :disabled="keyword.length <= 4 || isLoading"  @click="searchHandler">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Search</UiButton
        >
      </div>
      <UiPermissionGuard :permission=PermissionConstants.CREATE_CUSTOMER>
        <NuxtLink to="/customers/new" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Create New Customer</UiButton
          >
        </NuxtLink>
      </UiPermissionGuard>
    </div>

    <UiCard
      v-if="(!data || data.length === 0) && !isLoading && !isError"
      class="px-6 py-12 flex flex-col gap-1 items-center mt-6"
    >
      <h1 class="text-lg">Please search the customer first</h1>
      <p class="text-muted-foreground">
        Find customer by customer id, full name or phone number.
      </p>
    </UiCard>

    <div v-if="isLoading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>

    <div
      v-else-if="data && data.length > 0 && !isError"
      class="py-5 flex flex-col space-y-6 mx-auto"
    >
      <UiDataTable :columns="columns" :data="data">
        <template v-slot:toolbar="{ table }"> </template>
      </UiDataTable>
      
    </div>

    <div v-if="isError">
      <ErrorMessage :retry="fetchData" title="Something went wrong." />
    </div>
  </div>
</template>
