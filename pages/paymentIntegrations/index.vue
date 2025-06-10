<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePaymentIntegrations } from "~/composables/usePaymentIntegrations";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { columns as tableColumns } from "~/components/paymentIntegrations/columns"; // Renamed to avoid conflict
import type { PaymentIntegration } from "~/types";

const { getPaymentIntegrations } = usePaymentIntegrations();
const keyword = ref<string>("");
const data = ref<PaymentIntegration[]>([]);
const isLoading = ref(false);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const fetchPaymentIntegrationData = async () => {
  try {
    isLoading.value = true;
    const paymentIntegrations = await getPaymentIntegrations(0, 1000);
    // Sort integrations by name alphabetically
    data.value = paymentIntegrations?.sort((a, b) =>
      a?.integrationName
        .toLowerCase()
        .localeCompare(b?.integrationName.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching payment integrations:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchPaymentIntegrationData();
});

const refetch = async () => {
  await fetchPaymentIntegrationData();
};

// Provide the refetch function
provide("refetchPaymentIntegrations", refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div
    v-if="isLoading"
    class="py-10 flex justify-center items-center w-full h-[50vh]"
  >
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard permission="CREATE_PAYMENT_INTEGRATION">
      <NuxtLink to="/paymentIntegrations/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Configure New</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by integration name"
              :model-value="(table?.getColumn('integrationName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('integrationName')
                  ?.setFilterValue($event.target.value)
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
