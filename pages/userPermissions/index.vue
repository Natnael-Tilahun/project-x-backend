<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "../../components/userPermissions/columns";
import { usePermissions } from "~/composables/usePermissions";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Permission } from "~/types";

const { getPermissions, isLoading } = usePermissions();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Permission[]>([]);

const refetch = async () => {
  await fetchData();
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const permissions = await getPermissions(0,100000);
    data.value = permissions.sort((a: Permission, b: Permission) =>
      a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
    );
  } catch (err) {
    console.error("Error fetching users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("permissionsData", async () => {
  await fetchData();
});
</script>
<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && data?.length > 0"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <NuxtLink to="/userPermissions/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        User Permission</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by User Permission Code"
              :model-value="(table?.getColumn('code')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('code')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No permission found." />
  </div>
  <div v-else>
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>

<style lang="postcss" scoped></style>
