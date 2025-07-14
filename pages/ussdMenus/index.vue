<script setup lang="ts">
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { UssdMenuList } from "~/types";
import { ref, onMounted, provide, computed } from "vue"; // Added provide, useAsyncData, computed
import { columns as tableColumns } from "~/components/ussdMenus/columns";
import { toast } from "~/components/ui/toast";

const { getUssdMenusWithChilds, isLoading, cacheUssdMenusToRedis } = useUssdMenus();
const keyword = ref<string>("");
const data = ref<UssdMenuList[]>([]);
const loading = ref(isLoading.value);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const getUssdMenusData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const ussdMenus = await getUssdMenusWithChilds(0, 100);
    data.value = ussdMenus?.sort((a, b) =>
      a.menuName.toLowerCase().localeCompare(b.menuName.toLowerCase())
    ) ?? [];
  } catch (error) {
    console.error("Error fetching ussd menus:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const cacheUssdMenusToRedisData = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    const ussdMenus = await cacheUssdMenusToRedis();
    await getUssdMenusData();
    toast({
      title: "Ussd Menus cached to redis successfully",
      description: "Ussd Menus cached to redis successfully",
    });
  } catch (error) {
    console.error("Error caching ussd menus to redis:", error);
    toast({
      title: "Failed to cache ussd menus to redis",
      description: "Failed to cache ussd menus to redis",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

await useAsyncData("ussdMenusData", async () => {
  await getUssdMenusData();
});

const refetch = async () => {
  await getUssdMenusData();
};

// Provide the refetch function
provide('refetchUssdMenus', refetch);
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
  <div class="flex flex-col justify-end md:flex-row gap-4">
    <!-- <UiPermissionGuard :permission="PermissionConstants.CREATE_USSD_MENU">
      <NuxtLink to="/ussdMenus/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New Ussd Menu</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard> -->
    <!-- <UiPermissionGuard :permission="PermissionConstants.CREATE_USSD_MENU"> -->
        <UiButton class="w-fit self-end px-5" :disabled="isLoading" @click="cacheUssdMenusToRedisData"
          ><Icon v-if="!isLoading" name="material-symbols:refresh" size="24" class="mr-2"></Icon>
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Cache Ussd Menus to Redis</UiButton
        >
    <!-- </UiPermissionGuard> -->
  </div>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Menu Name"
              :model-value="(table?.getColumn('menuName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('menuName')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !isLoading" class="w-full">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
