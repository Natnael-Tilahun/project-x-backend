<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { PaymentOperationType } from "@/global-types";
import { columns } from "~/components/paymentOperations/columns";
import type { PaymentOperation } from "~/types";

const {
  getPaymentIntegrations,
  getPaymentIntegrationById,
  getPaymentIntegrationPaymentOperations,
} = usePaymentIntegrations();

const openItems = ref("configuration");
const route = useRoute();

const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<PaymentOperation[]>([]);
integrationId.value = route.params.id as string;
const activeTab = route.query.activeTab as string;
console.log("integrationId: ", integrationId.value);

const getAllPaymentOperations = async () => {
  try {
    loading.value = true;
    const response = await getPaymentIntegrationPaymentOperations(
      integrationId.value
    );
    data.value = response;
    console.log("data: ", data.value);
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
<UiPermissionGuard permission="CREATE_PAYMENT_OPERATIONS" >
  
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
