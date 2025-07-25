<script setup lang="ts">
import { ref, provide, computed } from "vue"; // Added provide, useAsyncData, computed
import { columns as tableColumns } from "~/components/ussdLanguages/columns"; // Renamed to avoid conflict
import { useUssdLanguages } from "~/composables/useUssdLanguages";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { UssdLanguage } from "~/types";
import { PermissionConstants } from "~/constants/permissions";
import { toast } from "~/components/ui/toast";

const { getUssdLanguages, isLoading: composableIsLoading, cacheLanguagesToRedis } = useUssdLanguages(); // Renamed
const data = ref<UssdLanguage[]>([]);
const pageIsLoading = ref(true); // For overall page loading, distinct from composable's
const isError = ref(false);
const isLoading = ref(false);

const getUssdLanguageData = async () => {
  try {
    pageIsLoading.value = true; // Use page's loading state
    isError.value = false;
    const ussdLanguages = await getUssdLanguages(0, 100);
    data.value = ussdLanguages?.sort((a, b) =>
      a.languageName.toLowerCase().localeCompare(b.languageName.toLowerCase())
    ) ?? [];
  } catch (error) {
    console.error("Error fetching ussd languages:", error);
    isError.value = true;
  } finally {
    pageIsLoading.value = false; // Use page's loading state
  }
};

const cacheLanguagesToRedisData = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    const ussdLanguages = await cacheLanguagesToRedis();
    await getUssdLanguageData();
    toast({
      title: "Languages cached to redis successfully",
      description: "Languages cached to redis successfully",
    });
  } catch (error) {
    console.error("Error caching languages to redis:", error);
    toast({
      title: "Failed to cache languages to redis",
      description: "Failed to cache languages to redis",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Initial data fetch
await useAsyncData("ussdLanguagesData", async () => {
  await getUssdLanguageData();
  // pageIsLoading will be set to false by getUssdLanguageData
});

const refetch = async () => {
  await getUssdLanguageData();
};

// Provide the refetch function
provide('refetchUssdLanguages', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

</script>

<template>
  <div v-if="pageIsLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && data.length > 0 && !isError && !pageIsLoading"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
  <div class="flex flex-col justify-end md:flex-row gap-4">
    <UiPermissionGuard :permission="PermissionConstants.CREATE_USSD_LANGUAGE">
      <NuxtLink to="/ussdLanguages/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New USSD Language</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiPermissionGuard :permission="PermissionConstants.CREATE_USSD_LANGUAGE">
        <UiButton class="w-fit self-end px-5" :disabled="isLoading" @click="cacheLanguagesToRedisData"
          ><Icon v-if="!isLoading" name="material-symbols:refresh" size="24" class="mr-2"></Icon>
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Cache Languages to Redis</UiButton
        >
    </UiPermissionGuard>
  </div>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <UiInput
              placeholder="Filter by Language Name"
              :model-value="(table?.getColumn('languageName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('languageName')
                  ?.setFilterValue($event.target.value)
              "
            />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-else-if="data && data.length === 0 && !isError && !pageIsLoading" class="py-10 text-center w-full">
    <p class="text-lg text-gray-600">No USSD languages found.</p>
    <UiPermissionGuard permission="CREATE_USSD_LANGUAGES">
        <NuxtLink to="/ussdLanguages/new" class="mt-4 inline-block">
            <UiButton class="px-5">
                <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
                Create New USSD Language
            </UiButton>
        </NuxtLink>
    </UiPermissionGuard>
  </div>
  <div v-if="isError && !pageIsLoading" class="w-full">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>