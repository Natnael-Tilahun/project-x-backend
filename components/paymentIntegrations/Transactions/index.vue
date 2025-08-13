<script lang="ts" setup>
import { ref } from "vue";
import { columns as tableColumns } from "~/components/paymentIntegrations/Transactions/columns"; // Renamed to avoid conflict

import type { PaymentOperation, ThirdPartyTransactionDetail } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const {
  getThirdPartyPaymentTransactionsByPaymentIntegrationId,
  getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId,
  getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId
} = usePaymentIntegrations();

const route = useRoute();

const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<ThirdPartyTransactionDetail[]>([]);
integrationId.value = route.params.id as string;
const customerId = ref<string>("")
const debitAccountNumber = ref<string>("")
const isLoading = ref<boolean>(false)
const selectedSearchOption = ref<string>("customerId")

const searchOptions = [
  { label: "Search by customer ID", value: "customerId" },
  { label: "Search by debit account number", value: "debitAccountNumber" }
]

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
  isError.value = false
  await getAllPaymentTransactions();
};

// Provide the refetch function
provide('refetchApiTransactions', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

const searchHandler = async () => {
  try {
    isLoading.value = true;
    let response;
    
    if (selectedSearchOption.value === "customerId") {
      response = await getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId(
        customerId.value, 
        integrationId.value
      );
    } else if (selectedSearchOption.value === "debitAccountNumber") {
      response = await getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId(
        debitAccountNumber.value, 
        integrationId.value
      );
    }
    
    if (response) {
      data.value = response;
    }
  } catch (err: any) {
    console.error("Error fetching transactions:", err.message);
    if (err.message === "transaction not found") {
      data.value = [];
    } else {
      isError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

const clearSearch = () => {
  customerId.value = "";
  debitAccountNumber.value = "";
  getAllPaymentTransactions();
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
        <div class="flex items-center gap-4">
          <UiSelect v-model="selectedSearchOption">
            <FormControl>
              <UiSelectTrigger class="min-w-[200px] px-4">
                <UiSelectValue placeholder="Select search option" />
              </UiSelectTrigger>
            </FormControl>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem
                  v-for="option in searchOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </UiSelectItem>
              </UiSelectGroup>
            </UiSelectContent>
          </UiSelect>
          
          <UiInput
            v-if="selectedSearchOption === 'customerId'"
            type="search"
            @keyup.enter="searchHandler"
            placeholder="Enter customer ID"
            class="md:w-[200px] lg:w-[350px]"
            v-model="customerId"
          />
          
          <UiInput
            v-else-if="selectedSearchOption === 'debitAccountNumber'"
            type="search"
            @keyup.enter="searchHandler"
            placeholder="Enter debit account number"
            class="md:w-[200px] lg:w-[350px]"
            v-model="debitAccountNumber"
          />
          
          <UiButton @click="searchHandler" :disabled="!customerId && !debitAccountNumber">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Search
          </UiButton>
          
          <UiButton variant="outline" @click="clearSearch">
            Clear
          </UiButton>
        </div>  
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !loading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
