<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Application } from "~/types";
import { columns as tableColumns } from "~/components/applications/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getApplications } = useApplications();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Application[]>([]);
const { pageNumber } = usePagesInfoStore();


const fetchApplicationsData = async () => {
  try {
    isLoading.value = true;
    data.value = await getApplications(); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching applications:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchApplicationsData();
});

const refetch = async () => {
  await fetchApplicationsData();
};

// Provide the refetch function
provide('refetchApplications', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
  <UiPermissionGuard :permission="PermissionConstants.CREATE_APPLICATIONS" >
    <NuxtLink to="/applications/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New
        Application</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Application Name"
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
  <div v-else-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
