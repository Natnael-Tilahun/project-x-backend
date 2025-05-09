<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/ussdLanguages/columns";
import { useUssdLanguages } from "~/composables/useUssdLanguages";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { UssdLanguage } from "~/types";

const { getUssdLanguages, isLoading } = useUssdLanguages();
const keyword = ref<string>("");
const data = ref<UssdLanguage[]>([]);
const loading = ref(isLoading.value);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const getUssdLanguageData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const ussdLanguages = await getUssdLanguages(0, 100);
    // Sort integrations by name alphabetically
    data.value = ussdLanguages.sort((a, b) =>
      a.languageName.toLowerCase().localeCompare(b.languageName.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching ussd languages:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("ussdLanguagesData", async () => {
  await getUssdLanguageData();
});

const refetch = async () => {
  await getUssdLanguageData();
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
    <UiPermissionGuard permission="CREATE_USSD_LANGUAGES">
      <NuxtLink to="/ussdLanguages/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New USSD Language</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search..."
            class="md:w-[100px] lg:w-[300px]"
            v-model="keyword"
          />
          <UiButton @click="">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError && !isLoading">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
