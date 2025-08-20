<script lang="ts" setup>
import { ref } from "vue";
import { columns as tableColumns } from "~/components/paymentIntegrations/Transactions/columns"; // Renamed to avoid conflict
import ServerPagination from "~/components/ui/ServerPagination.vue";

import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";

const integrationId = ref<string>("");
integrationId.value = getIdFromPath()
const customerId = ref<string>("")
const debitAccountNumber = ref<string>("")
const selectedSearchOption = ref<string>("customerId")

const {
  page,
  size,
  sort,
  transactions: data,
  total,
  loading: isLoading,
  error: isError,
  fetchTransactions: fetchData,
      onPageChange,
  onSizeChange,
  onSortChange,
  getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId,
  getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId
} = usePaymentIntegrationsTransactions(integrationId);

const searchOptions = [
  { label: "Search by customer ID", value: "customerId" },
  { label: "Search by debit account number", value: "debitAccountNumber" }
]

// Provide the refetch function
provide('refetchApiTransactions', fetchData);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchData));

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
  fetchData()
};
</script>

<template>
  <div
    v-if="isLoading"
    class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
  >
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && !isLoading"
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
    <ServerPagination
      :page="page"
      :size="size"
      :total="total"
      :on-page-change="onPageChange"
      :on-size-change="onSizeChange"
    />
  </div>
  <div v-if="isError && !isLoading">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
