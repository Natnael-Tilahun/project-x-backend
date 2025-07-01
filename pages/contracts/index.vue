<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Contract } from "~/types";
import { columns as tableColumns } from "~/components/contracts/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getContracts, getContractById, searchContract } =
  useContracts();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Contract[]>([]);
const keyword = ref<string>("");

const fetchContractsData = async () => {
  try {
    isLoading.value = true;
    const contracts = await getContracts(0, 100000000);
    data.value = contracts;
  } catch (err: any) {
    console.error("Error fetching contracts:", err);
  } finally {
    isLoading.value = false;
  }
};

const searchHandler = async () => {
  try {
    isLoading.value = true;
    const response = await searchContract(keyword.value); // Call your API function to fetch roles
    if (response) {
      data.value = [];
      data.value.push(response);
    }
  } catch (err: any) {
    console.error("Error fetching contracts:", err.message);
    if (err.message == "Contract not found") {
      data.value = [];
    } else {
      isError.value = true;
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchContractsData();
});

const refetch = async () => {
  await fetchContractsData();
};

// Provide the refetch function
provide('refetchContracts', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
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
    <UiPermissionGuard :permission="PermissionConstants.CREATE_CONTRACTS">
      <NuxtLink to="/contracts/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create Contract</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            @keyup.enter="searchHandler"
            placeholder="Search by customer id or account number"
            class="md:w-[200px] lg:w-[350px]"
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
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
