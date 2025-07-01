<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/contracts/CoreCustomers/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
import type { ContractCoreCustomer, Contract } from "~/types";

const { getContractCoreCustomers, getContractCoreCustomerById, isLoading } = useContractsCoreCustomers();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ContractCoreCustomer[]>([]);
const keyword = ref<string>("");
const route = useRoute();
const contractId = ref<string>("");
contractId.value = getIdFromPath();

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const contracts = await getContractCoreCustomers(contractId.value, 0, 100000000);
    data.value = contracts;
  } catch (err: any) {
    console.error("Error fetching contract core customers:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("contractCoreCustomersData", async () => {
  await fetchData();
});

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getContractCoreCustomerById(contractId.value, keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching contract core customers:", err);
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
  <UiPermissionGuard :permission="PermissionConstants.CREATE_CONTRACT_CORE_CUSTOMER" >
    <!-- <NuxtLink to="/contracts/newCoreCustomer" class="w-fit self-end"> -->
      <UiButton   
      @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newCoreCustomer',
              },
            })"
             class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        Contract Core Customer</UiButton
      >
    <!-- </NuxtLink> -->
     </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by core customer Id"
              :model-value="(table?.getColumn('coreCustomerId')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('coreCustomerId')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
