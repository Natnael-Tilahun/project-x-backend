<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { columns as tableColumns } from "~/components/integrations/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const isDownloading = ref(false);
const openImportDialog = ref(false);

const closeImportDialog = async () => {
  openImportDialog.value = false;
};

const {
  page,
  size,
  sort,
  integrations: data,
  total,
  loading: isLoading,
  error: isError,
  fetchIntegrations: fetchData,
  onPageChange,
  onSizeChange,
  onSortChange,
} = useIntegrations();

provide('refetchApiIntegrations', fetchData);


const columns = computed(() => tableColumns(fetchData));
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
              @refresh="fetchData"
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
