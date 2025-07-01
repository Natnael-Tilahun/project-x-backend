<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/customers/contracts/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
import type { Contract } from "~/types";

const { getContractById, getContractByCoreCustomerId, isLoading } =
  useContracts();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Partial<Contract>[]>([]);
const keyword = ref<string>("");
const coreCustomerId = ref<string>("");
const customerId = ref<string>("");

const props = defineProps<{
  customerId: string;
  coreCustomerId?: string;
}>();

if (props.coreCustomerId) {
  coreCustomerId.value = props.coreCustomerId;
}

if (props.customerId) {
  customerId.value = props.customerId;
}

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const response = await getContractByCoreCustomerId(coreCustomerId.value);
    if (response) {
      data.value.push(response);
    }
  } catch (err: any) {
    console.error("Error fetching contracts:", err);
    if (err == "Error: 404 NOT_FOUND") {
      data.value = [];
      isError.value = false;
      toast({
        title: "No Contract found for this customer.",
      });
      console.log("data.vaue: ", data.value);
      return;
    }

    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("contractsData", async () => {
  await fetchData();
});
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
    <UiPermissionGuard :permission="PermissionConstants.CREATE_CONTRACTS">
      <NuxtLink v-if="data.length > 0" 
      @click="
          navigateTo({
            path: `/contracts/${data[0].id}`,
            query: {
              activeTab: 'newCoreCustomer',
            },
          })"
      class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Add Customer ID</UiButton
        >
      </NuxtLink>
      <NuxtLink v-else to="/contracts/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create Contract</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }"> </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
