<script lang="ts" setup>
import { ref } from "vue";
import { columns as tableColumns } from "~/components/paymentIntegrations/Transactions/columns"; // Renamed to avoid conflict

import type { PaymentOperation, ThirdPartyTransactionDetail } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const {
  getThirdPartyPaymentTransactionsByPaymentIntegrationId,
  getThirdPartyPaymentTransactionsByCustomerAndIntegrationId
} = usePaymentIntegrations();

const route = useRoute();

const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<ThirdPartyTransactionDetail[]>([]);
integrationId.value = route.params.id as string;
const customerId = ref<string>("")
const isLoading = ref<boolean>(false)

const getAllPaymentTransactions = async () => {
  try {
    loading.value = true;
    const response = await getThirdPartyPaymentTransactionsByPaymentIntegrationId(
      integrationId.value
    );
    data.value = response;
  } catch (err) {
    console.error("Error fetching payment integration transactions:", err);
    isError.value = true;
  } finally {
    loading.value = false; // Reset loading state
  }
};

onMounted(() => {
  getAllPaymentTransactions();
});

const refetch = async () => {
  await getAllPaymentTransactions();
};

// Provide the refetch function
provide('refetchApiTransactions', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

const searchHandler = async () => {
  try {
    isLoading.value = true;
    const response = await getThirdPartyPaymentTransactionsByCustomerAndIntegrationId(customerId.value, integrationId.value); // Call your API function to fetch roles
    if (response) {
      data.value = response
    }
  } catch (err: any) {
    console.error("Error fetching customer transactions for this integration:", err.message);
    if (err.message == "transaction not found") {
      data.value = [];
    } else {
      isError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    v-if="loading"
    class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
  >
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && !loading"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <div class="flex items-center gap-4">
          <UiInput
            type="search"
            @keyup.enter="searchHandler"
            placeholder="Search by customer id or account number"
            class="md:w-[200px] lg:w-[350px]"
            v-model="customerId"
          />
          <UiButton @click="searchHandler">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>   -->
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !loading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
