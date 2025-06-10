<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Merchant } from "~/types";
import { columns as tableColumns } from "~/components/merchants/columns"; // Renamed to avoid conflict

const { getMerchants, getMerchantById } = useMerchants();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Merchant[]>([]);
const keyword = ref<string>("");

const fetchMerchantsData = async () => {
  try {
    isLoading.value = true;
    const merchants = await getMerchants(0, 100000000);
    // Sort integrations by name alphabetically
    data.value = merchants?.sort((a, b) =>
      a?.businessName?.toLowerCase().localeCompare(b?.businessName?.toLowerCase())
    );
  } catch (err: any) {
    console.error("Error fetching merchants:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value[0] = await getMerchantById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching merchants:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMerchantsData();
});

const refetch = async () => {
  await fetchMerchantsData();
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
    <UiPermissionGuard permission="CREATE_MERCHANTS" >
    <NuxtLink to="/merchants/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Merchant</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by business name"
              :model-value="(table?.getColumn('businessName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('businessName')?.setFilterValue($event.target.value)
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
