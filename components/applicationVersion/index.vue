<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath, splitPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/applicationVersion/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const applicationId = ref<string>("");
const route = useRoute();
applicationId.value = getIdFromPath()

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
} = useApplications(applicationId);

// Provide the refetch function
provide('refetchApplicationVersions', fetchData);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchData));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div v-else-if="data && !isError" class="py-4 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard :permission="PermissionConstants.CREATE_APPLICATION_VERSION">
      <NuxtLink class="w-fit self-end" @click="
        navigateTo({
          path: route.path,
          query: {
            activeTab: 'newApplicationVersion',
          },
        })
        ">
        <UiButton>
          <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
          Add New Application Version
        </UiButton>
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data" :loading="isLoading">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput placeholder="Filter by Application Version Name"
              :model-value="(table?.getColumn('versionName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]" @input="
                table
                  ?.getColumn('versionName')
                  ?.setFilterValue($event.target.value)
                " />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    <ServerPagination :page="page" :size="size" :total="total" :on-page-change="onPageChange"
      :on-size-change="onSizeChange" />
  </div>

  <div v-else-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
