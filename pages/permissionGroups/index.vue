<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { columns } from "~/components/permissionGroups/columns";
import type { PermissionGroup } from "~/types";

const { getPermissionGroups, getPermissionGroupById, isLoading } = usePermissionGroups();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<PermissionGroup[]>([]);

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const permissionGroups = await getPermissionGroups();
    data.value = permissionGroups;
  } catch (err: any) {
    console.error("Error fetching permission groups:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("permissionGroupsData", async () => {
  await fetchData();
});

</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
  <UiPermissionGuard permission="CREATE_PERMISSION_GROUPS" >
    <NuxtLink to="/permissionGroups/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Permission Group</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">

    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
