<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/contracts/Users/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath } from "~/lib/utils";
import type { ContractCoreCustomer, Contract, ContractUser } from "~/types";

const { getContractUserById, getContractUserByContractId, isLoading } = useContractsUsers();
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

const refetch = async () => {
  await fetchData();
};

await useAsyncData("contractUsersData", async () => {
  await fetchData();
});

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
      <UiPermissionGuard permission="CREATE_CONTRACT_USERS" >
      <UiButton   
      @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newUser',
              },
            })"
             class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
          Contract User</UiButton
      >
      </UiPermissionGuard>
    <!-- </NuxtLink> -->
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search by phone number or email"
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
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
