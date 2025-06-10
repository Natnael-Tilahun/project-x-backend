<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Role } from "~/types";
import { columns as tableColumns } from "~/components/userRoles/columns"; // Renamed to avoid conflict

const { getRoles,  } = useRoles();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Role[]>([]);
const { pageNumber } = usePagesInfoStore();

const fetchSystemRoleData = async () => {
  try {
    isLoading.value = true;
    data.value = await getRoles(); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching roles:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSystemRoleData();
});

const refetch = async () => {
  await fetchSystemRoleData();
};

// Provide the refetch function
provide('refetchSystemRoles', refetch);

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
    <UiPermissionGuard permission="CREATE_ROLES" >
    <NuxtLink to="/userRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New
        Role</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Role Name"
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

  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
