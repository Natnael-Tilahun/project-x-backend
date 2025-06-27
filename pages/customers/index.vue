<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/customers/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Customer } from "~/types";
const { getCustomers, searchCustomers, isLoading } = useCustomers();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Customer[]>();
const keyword = ref<string>("");

const refetch = async () => {
  await fetchData();
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const customers = await getCustomers(0, 10000000000); // Call your API function to fetch roles
    // Sort integrations by name alphabetically, handling null values
    data.value = customers.sort((a: Customer, b: Customer) => {
      // Handle cases where fullName might be null
      const nameA = a.fullName?.toLowerCase() || "";
      const nameB = b.fullName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
  } catch (err: any) {
    console.error("Error fetching customers:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

// await useAsyncData("customersData", async () => {
//   await fetchData();
// });

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await searchCustomers(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching customers:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};
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
        <UiButton :disabled="keyword.length <= 4"  @click="searchHandler">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Search</UiButton
        >
      </div>
      <UiPermissionGuard permission="REGISTER_CUSTOMERS">
        <NuxtLink to="/customers/new" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Create New Customer</UiButton
          >
        </NuxtLink>
      </UiPermissionGuard>
    </div>

    <UiCard
      v-if="!data"
      class="px-6 py-12 flex flex-col gap-1 items-center mt-6"
    >
      <h1 class="text-lg">Please search the customer first</h1>
      <p class="text-muted-foreground">
        Find customer by customer id, full name or phone number.
      </p>
    </UiCard>

    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>

    <div
      v-else-if="data && !isError"
      class="py-5 flex flex-col space-y-6 mx-auto"
    >
      <UiDataTable :columns="columns" :data="data">
        <template v-slot:toolbar="{ table }"> </template>
      </UiDataTable>
    </div>

    <div v-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
