<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns as tableColumns } from "~/components/contracts/Users/columns"; // Renamed to avoid conflict

import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
import type { ContractUser } from "~/types";

const { getContractUserById, getContractUserByContractId, isLoading } =
  useContractsUsers();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ContractUser[]>([]);
const keyword = ref<string>("");
const route = useRoute();
const contractId = ref<string>("");
contractId.value = getIdFromPath();

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const contracts = await getContractUserByContractId(contractId.value);
    data.value = contracts;
    console.log(data.value);
  } catch (err: any) {
    console.error("Error fetching contract users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getContractUserById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching contract users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};


onMounted(() => {
  fetchData();
});

const refetch = async () => {
  await fetchData();
};

// Provide the refetch function
provide('refetchContracts', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
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
    <!-- <NuxtLink to="/contracts/newCoreCustomer" class="w-fit self-end"> -->
    <UiPermissionGuard :permission="PermissionConstants.CREATE_CONTRACT_USER">
      <UiButton
        @click="
          navigateTo({
            path: route.path,
            query: {
              activeTab: 'newUser',
            },
          })
        "
        class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add User</UiButton
      >
    </UiPermissionGuard>
    <!-- </NuxtLink> -->
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by customer name"
              :model-value="(table?.getColumn('customer')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('customer')?.setFilterValue($event.target.value)
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
