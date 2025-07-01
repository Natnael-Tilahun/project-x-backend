<script lang="ts" setup>
import { ref } from "vue";
import { columns as tableColumns } from "~/components/paymentOperations/columns"; // Renamed to avoid conflict

import type { PaymentOperation } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const {
  getPaymentIntegrationPaymentOperations,
} = usePaymentIntegrations();

const route = useRoute();

const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<PaymentOperation[]>([]);
integrationId.value = route.params.id as string;

const getAllPaymentOperations = async () => {
  try {
    loading.value = true;
    const response = await getPaymentIntegrationPaymentOperations(
      integrationId.value
    );
    data.value = response;
  } catch (err) {
    console.error("Error fetching payment integration operations:", err);
    isError.value = true;
  } finally {
    loading.value = false; // Reset loading state
  }
};

onMounted(() => {
  getAllPaymentOperations();
});

const refetch = async () => {
  await getAllPaymentOperations();
};

// Provide the refetch function
provide('refetchApiOperations', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
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
<UiPermissionGuard :permission="PermissionConstants.CREATE_PAYMENT_OPERATION" >
  
    <UiButton
      @click="
        navigateTo({
          path: route.path,
          query: {
            activeTab: 'newPaymentOperation',
          },
        })
      "
      class="w-fit self-end px-5"
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Configure
      New</UiButton
    >
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }"> </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !loading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
