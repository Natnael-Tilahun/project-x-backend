<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ServiceDefinition } from "~/types";
import { columns as tableColumns } from "~/components/serviceDefinitions/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getServiceDefinitions, getServiceDefinitionById } = useServiceDefinitions();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<ServiceDefinition[]>([]);
const keyword = ref<string>("");

const fetchServiceDefinitionsData = async () => {
  try {
    isLoading.value = true;
    const serviceDefinitions = await getServiceDefinitions(0, 100000000);
    data.value = serviceDefinitions;
  } catch (err: any) {
    console.error("Error fetching service definitions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value[0] = await getServiceDefinitionById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching service definitions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchServiceDefinitionsData();
};

onMounted(async () => {
    await fetchServiceDefinitionsData();
});

// Provide the refetch function
provide('refetchserviceDefinitions', refetch);

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
  <UiPermissionGuard :permission=PermissionConstants.CREATE_SERVICE_DEFINITIONS >
    <NuxtLink to="/serviceDefinitions/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Service Definition</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
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
