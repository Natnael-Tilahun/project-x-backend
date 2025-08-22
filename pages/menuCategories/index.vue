<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMenus } from "~/composables/useMenus";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Menu } from "~/types";
import { columns as tableColumns } from "~/components/menus/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const keyword = ref<string>("");
const router = useRouter(); // {{ edit_2 }}
const openImportDialog = ref(false)
const isDownloading = ref(false);

// data.value = menus?.sort((a, b) =>
//   a?.menuName?.toLowerCase().localeCompare(b?.menuName?.toLowerCase())
// );

const closeImportDialog = async () => {
  openImportDialog.value = false
};

const {
  page,
  size,
  sort,
  offices: data,
  total,
  loading: isLoading,
  error: isError,
  fetchOffices: fetchData,
  onPageChange,
  onSizeChange,
  onSortChange,
} = useMenus();

provide('refetchMenus', fetchData);


const columns = computed(() => tableColumns(fetchData));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div v-else-if="data && !isError && !isLoading" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard :permission=PermissionConstants.CREATE_INTEGRATION_MENU>
      <div class="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <NuxtLink to="/menuCategories/new" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5">
            <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Configure New
          </UiButton>
        </NuxtLink>

        <UiSheet v-model:open="openImportDialog">
          <UiSheetTrigger>
            <UiButton :disabled="isDownloading" type="submit">
              <Icon name="svg-spinners:8-dots-rotate" v-if="isDownloading" class="mr-2 h-4 w-4 animate-spin"></Icon>

              Import Menus
            </UiButton>
          </UiSheetTrigger>

          <UiSheetContent class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto">
            <MenusImportMenus @closeImportDialog="closeImportDialog" @refresh="fetchData" />
          </UiSheetContent>
        </UiSheet>
        <MenusExportAllMenus />
      </div>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput placeholder="Filter by menu name"
              :model-value="(table?.getColumn('menuName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]" @input="
                table?.getColumn('menuName')?.setFilterValue($event.target.value)
                " />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    <ServerPagination :page="page" :size="size" :total="total" :on-page-change="onPageChange"
      :on-size-change="onSizeChange" />
  </div>
  <div v-if="isError && !isLoading">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
