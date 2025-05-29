<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/menus/columns";
import { useMenus } from "~/composables/useMenus";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Menu } from "~/types";

const { getMenus, isLoading } = useMenus();
const keyword = ref<string>("");
const data = ref<Menu[]>([]);
const loading = ref(isLoading.value);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const getMenuData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const menus = await getMenus(0, 100);
    // Sort integrations by name alphabetically
    data.value = menus.sort((a, b) =>
      a.menuName.toLowerCase().localeCompare(b.menuName.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("menusData", async () => {
  await getMenuData();
});

const refetch = async () => {
  await getMenuData;
};
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && !isLoading"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
  <UiPermissionGuard permission="CREATE_INTEGRATION_MENUS" >
    <NuxtLink to="/menuCategories/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
        >Configure New</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by menu name"
              :model-value="(table?.getColumn('menuName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('menuName')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !isLoading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
