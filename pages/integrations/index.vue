<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useIntegrations } from "~/composables/useIntegrations";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ApiIntegration } from "~/types";
import { columns as tableColumns } from "~/components/integrations/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getIntegrations } = useIntegrations();
const keyword = ref<string>("");
const data = ref<ApiIntegration[]>([]);
const isLoading = ref(false);
const isDownloading = ref(false);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}
const openImportDialog = ref(false);

const getApiIntegrationData = async () => {
  try {
    isLoading.value = true;
    const integrations = await getIntegrations(0, 100);
    // Sort integrations by name alphabetically
    data.value =
      integrations?.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ) ?? [];
  } catch (error) {
    console.error("Error fetching integrations:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getApiIntegrationData();
});

const refetch = async () => {
  await getApiIntegrationData();
};

const closeImportDialog = async () => {
  openImportDialog.value = false;
};

// const searchHandler = async () => {
//   try {
//     isLoading.value = true;
//     loading.value = true;
//     data.value = await searchIntegrations(keyword.value); // Call your API function to fetch roles
//   } catch (err: any) {
//     console.error("Error fetching integrations:", err);
//     isError.value = true;
//   } finally {
//     isLoading.value = false;
//     loading.value = false;
//   }
// };

// Provide the refetch function

provide("refetchApiIntegrations", refetch);

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
    <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
      <UiPermissionGuard
        :permission="PermissionConstants.CREATE_API_INTEGRATION"
      >
        <NuxtLink to="/integrations/new" class="w-fit">
          <UiButton class="w-fit px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Configure New</UiButton
          >
        </NuxtLink>
      </UiPermissionGuard>
      <UiPermissionGuard
        :permission="PermissionConstants.IMPORT_API_INTEGRATION"
      >
        <UiSheet v-model:open="openImportDialog">
          <UiSheetTrigger>
            <UiButton :disabled="isDownloading" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="isDownloading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Import Integration
            </UiButton>
          </UiSheetTrigger>

          <UiSheetContent
            class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
          >
            <IntegrationsImportIntegration
              @closeImportDialog="closeImportDialog"
              @refresh="refetch"
            />
          </UiSheetContent>
        </UiSheet>
      </UiPermissionGuard>
      <UiPermissionGuard
        :permission="PermissionConstants.EXPORT_API_INTEGRATION"
      >
        <IntegrationsExportAllIntegrations />
      </UiPermissionGuard>
    </div>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by name"
              :model-value="(table?.getColumn('name')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('name')?.setFilterValue($event.target.value)
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
