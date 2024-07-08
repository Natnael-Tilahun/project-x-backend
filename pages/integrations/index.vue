<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/customers/columns";

const { getCustomers, searchCustomers, isLoading } = useCustomers();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Integration[]>([]);
const keyword = ref<string>("");

async function getIntegrations(): Promise<Integration[]> {
  // Fetch data from your API here.
  return [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      isDraft: true,
      integrationName: "string",
      companyName: "string",
      description: "string",
      iconPath: "string",
      enabled: true,
      accountNumber: "string",
      minimumAmount: 0,
      maximumAmount: 0,
      currencyCode: "string",
      paymentConfirmationTemplate: "string",
      paymentDetailTemplate: "string",
      paymentErrorTemplate: "string",
      integrationCategory: "PAYMENT",
      paymentSuccessTemplate: "string",
    },
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      isDraft: true,
      integrationName: "string",
      companyName: "string",
      description: "string",
      iconPath: "string",
      enabled: true,
      accountNumber: "string",
      minimumAmount: 0,
      maximumAmount: 0,
      currencyCode: "string",
      paymentConfirmationTemplate: "string",
      paymentDetailTemplate: "string",
      paymentErrorTemplate: "string",
      integrationCategory: "PAYMENT",
      paymentSuccessTemplate: "string",
    },
  ];
}

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getIntegrations(); // Call your API function to fetch roles
} catch (err: any) {
  console.error("Error fetching customers:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

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
  <div v-else-if="data" class="py-5 flex flex-col space-y-10 mx-auto">
    <NuxtLink to="/customers/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
        >Configure New</UiButton
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
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <UiErrorMessage title="Something went wrong." />
  </div>
</template>
