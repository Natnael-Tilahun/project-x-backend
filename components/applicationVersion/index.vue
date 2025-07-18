<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { splitPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/applicationVersion/columns"; // Renamed to avoid conflict
import type { AppVersion } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const { getApplicationVersions } = useApplications();
const loading = ref(false);
const isError = ref(false);
const data = ref<AppVersion[]>([]);
const { pageNumber } = usePagesInfoStore();
const applicationId = ref<string>("");
const route = useRoute();
const fullPath = ref(route.path);
const pathSegments = ref([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
applicationId.value = pathSegments.value[pathLength - 1];

const fetchApplicationVersionsData = async () => {
  if (!applicationId.value) return;

  try {
    loading.value = true;
    data.value = await getApplicationVersions(applicationId.value);
  } catch (err) {
    console.error("Error fetching applications versions:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchApplicationVersionsData();
};

onMounted(async () => {
  if (applicationId.value) {
    await fetchApplicationVersionsData();
  }
});

// Provide the refetch function
provide('refetchApplicationVersions', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<template>
  <div v-if="loading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
  <UiPermissionGuard :permission="PermissionConstants.CREATE_APPLICATION_VERSION" >
    <NuxtLink
      class="w-fit self-end"
      @click="
        navigateTo({
          path: route.path,
          query: {
            activeTab: 'newApplicationVersion',
          },
        })
      "
    >
      <UiButton>
        <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
        Add New Application Version
      </UiButton>
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data" :loading="loading">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Application Version Name"
              :model-value="(table?.getColumn('versionName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('versionName')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>

  <div v-else-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
