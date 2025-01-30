<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/customers/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";


const { getCustomers, searchCustomers, isLoading } = useCustomers();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Customer[]>([]);
const keyword = ref<string>("");

const refetch = async () => {
  await fetchData();
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const customers = await getCustomers(); // Call your API function to fetch roles
    // Sort integrations by name alphabetically, handling null values
    data.value = customers.sort((a, b) => {
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

onMounted(async () => {
  await fetchData();
});

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
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>

  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <NuxtLink to="/customers/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Customer</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search..."
            class="md:w-[100px] lg:w-[300px]"
            v-model="keyword"
          />
          <UiButton @click="searchHandler">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </template>
    </UiDataTable>
  </div>

  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
