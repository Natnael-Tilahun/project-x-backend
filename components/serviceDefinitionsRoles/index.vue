<script lang="ts" setup>
import { ref } from "vue";
import type { ServiceDefinitionRole, ServiceDefinition } from "~/types";
import { columns as tableColumns } from "~/components/serviceDefinitionsRoles/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";


const { getServiceDefinitionRolesByServiceDefinitionId } =
  useServiceDefinitionsRoles();

const route = useRoute();

const isLoading = ref(false);
const isError = ref(false);
const serviceDefinition = ref<ServiceDefinition>();
  const serviceDefinitionId = ref<string>("");
const data = ref<ServiceDefinitionRole[]>([]);

const props = defineProps<{
  serviceDefinitionProps?: ServiceDefinition;
}>();

if (props?.serviceDefinitionProps) {
  serviceDefinition.value = props?.serviceDefinitionProps;
  serviceDefinitionId.value = serviceDefinition.value.id || ""
}

const getServiceDefinitionRolesData = async () => {
  try {
    isLoading.value = true;
    const serviceDefinitionRoles = await getServiceDefinitionRolesByServiceDefinitionId(serviceDefinitionId.value, 0, 1000000);
    data.value = serviceDefinitionRoles;
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await getServiceDefinitionRolesData();
};

onMounted(async () => {
    await getServiceDefinitionRolesData();
});

// Provide the refetch function
provide('refetchserviceDefinitions', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="p-6 flex flex-col space-y-10 mx-auto"
  >
  
  <UiPermissionGuard
              :permission="PermissionConstants.CREATE_SERVICE_DEFINITION_ROLE"
            >
    <UiButton
      @click="
        navigateTo({
          path: route.path,
          query: {
            activeTab: 'newServiceDefinitionRole',
          },
        })
      "
      class="w-fit self-end px-5"
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
      New Role</UiButton
    >
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data || []">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by role name"
              :model-value="(table?.getColumn('roleName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('roleName')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError">
    <ErrorMessage :retry="getServiceDefinitionRolesData" title="Something went wrong." />
  </div>
</template>
