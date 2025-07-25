<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { MerchantBranch, MerchantTransaction } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/merchants/transactions/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getMerchantTransactions } = useMerchantTransactions();
const route = useRoute();
const fullPath = ref(route.path);
const isLoading = ref(false);
const isError = ref(false);
const data = ref<MerchantTransaction[]>([]);
const merchantId = ref<string>("");
merchantId.value = getIdFromPath();

const fetchMerchantTransactionsData = async () => {
  try {
    isLoading.value = true;
    const merchantBranches = await getMerchantTransactions(merchantId.value, 0, 10000);
    // Sort integrations by name alphabetically
    data.value = merchantBranches;
    // ?.sort(
    //   (a: MerchantBranch, b: MerchantBranch) => {
    //     if (a?.branchName && b?.branchName) {
    //       return a?.branchName
    //         .toLowerCase()
    //         .localeCompare(b?.branchName.toLowerCase());
    //     }
    //     return 0; // Return 0 if either firstname is missing
    //   }
    // );
  } catch (err: any) {
    console.error("Error fetching merchant transactions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchMerchantTransactionsData();
};

onMounted(() => {
  fetchMerchantTransactionsData();
});

// Provide the refetch function
provide("refetchMerchantTransactions", refetch);

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
    <UiPermissionGuard
      :permission="PermissionConstants.CREATE_STAFF_ASSIGNMENT"
    >
      <NuxtLink :to="`${fullPath}?activeTab=newBranch`" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New Branch</UiButton
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
