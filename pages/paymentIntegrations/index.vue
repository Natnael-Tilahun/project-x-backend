<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePaymentIntegrations } from "~/composables/usePaymentIntegrations";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { columns as tableColumns } from "~/components/paymentIntegrations/columns"; // Renamed to avoid conflict
import type { PaymentIntegration } from "~/types";
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue"; // Import ServerPagination

const keyword = ref<string>("");
const integrationData = ref<PaymentIntegration[]>([]);
const openImportDialog = ref(false)
const isDownloading = ref(false)




const closeImportDialog = async () => {
  openImportDialog.value = false
};



const {
  page,
  size,
  sort,
  offices: data, // Renamed to data for existing template usage
  total,
  loading: isLoading, // Renamed to isLoading for existing template usage
  error: isError, // Renamed to isError for existing template usage
  fetchOffices: fetchData, // Renamed to fetchData for existing template usage
  onPageChange,
  onSizeChange,
  onSortChange,
} = usePaymentIntegrations();

// if(!isLoading && !isError){
//   integrationData.value = data.value?.sort((a, b) =>
//       a?.integrationName
//         .toLowerCase()
//         .localeCompare(b?.integrationName.toLowerCase())
//     );
//  }
 


// Provide the fetchSystemRoles function for columns
provide('refetchPaymentIntegrations', fetchData);

// Generate columns by passing the fetchSystemRoles function
const columns = computed(() => tableColumns(fetchData));

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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_PAYMENT_INTEGRATION>
      <div class="flex flex-col md:flex-row w-full md:items-center md:justify-end gap-4">

      <NuxtLink to="/paymentIntegrations/new" class="w-fit">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Configure New</UiButton
        >
      </NuxtLink>

      <UiSheet v-model:open="openImportDialog">
          <UiSheetTrigger>
            <UiButton class="self-end" :disabled="isDownloading" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="isDownloading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Import Payment Integration
            </UiButton>
          </UiSheetTrigger>
          <UiSheetContent
            class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
          >
            <PaymentIntegrationsImportPaymentIntegration @closeImportDialog="closeImportDialog"  @refresh="fetchData" />
          </UiSheetContent>
        </UiSheet>
        <PaymentIntegrationsExportAllPaymentIntegrations />
        </div>
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
        <ServerPagination
      :page="page"
      :size="size"
      :total="total"
      :on-page-change="onPageChange"
      :on-size-change="onSizeChange"
    />
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
