<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/integrations/columns";
import { useIntegrations } from "~/composables/useIntegrations";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";

const { getIntegrations } = useIntegrations();
const keyword = ref<string>("");
const data = ref<ApiIntegration[]>([]);
const isLoading = ref(true);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const fetchData = async () => {
  try {
    const integrations = await getIntegrations(0, 100);
    // Sort integrations by name alphabetically
    data.value = integrations.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching integrations:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

await useAsyncData("integrationsData", async () => {
  await fetchData();
});

const refetch = async () => {
  await fetchData();
};

// const searchHandler = async () => {
//   try {
//     isLoading.value = true;
//     loading.value = true;
//     data.value = await searchIntegrations(keyword.value); // Call your API function to fetch roles
//   } catch (err: any) {
//     console.error("Error fetching integrations:", err);
//     isError.value = true;
//   } finally {
//     isLoading.value = false;
//     loading.value = false;
//   }
// };
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <NuxtLink to="/integrations/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
        >Configure New</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
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
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
