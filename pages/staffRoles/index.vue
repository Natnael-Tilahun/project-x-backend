<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/staffRoles/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Role } from "~/types";

const { getStaffRoles, isLoading } = useStaffRoles();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Role[]>([]);
const { pageNumber } = usePagesInfoStore();

const refetch = async () => {
  await fetchData();
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getStaffRoles(); // Call your API function to fetch roles
    console.log("jdhf: ", data.value)
  } catch (err) {
    console.error("Error fetching staff roles:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("staffRolesData", async () => {
  await fetchData();
});
</script>

<template>
  <div v-if="loading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard permission="CREATE_ROLES" >
    <NuxtLink to="/staffRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New Staff
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

  <!-- <div v-else-if="data && !isError ">
    <UiNoResultFound title="Sorry, No role found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
