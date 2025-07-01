<script setup lang="ts">
import { ref, onMounted, provide, computed } from "vue"; // Added provide, useAsyncData, computed
import { columns as tableColumns } from "~/components/ussdLocalizedMenus/columns"; // Renamed to avoid conflict
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { LocalizedUssdMenu } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const { getUssdLocalizedMenus } = useUssdLocalizedMenus();
const keyword = ref<string>("");
const data = ref<LocalizedUssdMenu[]>([]);
const isLoading = ref(false);
const isError = ref(false);

const getUssdLocalizedMenusData = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    const ussdLocalizedMenus = await getUssdLocalizedMenus(0, 100);
    // Sort integrations by name alphabetically
    const sortedData = ussdLocalizedMenus?.sort((a, b) =>
      a.message.toLowerCase().localeCompare(b.message.toLowerCase())
    ) ?? [];
    // Force reactivity update by creating a new array
    data.value = [...sortedData];
  } catch (error) {
    console.error("Error fetching ussd localized menus:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getUssdLocalizedMenusData();
});


const refetch = async () => {
  await getUssdLocalizedMenusData();
};

// Provide the refetch function
provide('refetchUssdLocalizedMenus', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
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
    <UiPermissionGuard :permission="PermissionConstants.CREATE_USSD_LOCALIZED_MENU">
      <NuxtLink to="/ussdLocalizedMenus/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New Localized Menu</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by menu message"
              :model-value="(table?.getColumn('message')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('message')?.setFilterValue($event.target.value)
              "
            />
          </div>
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !isLoading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
