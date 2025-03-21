<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "@/components/serviceDefinitions/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ServiceDefinition } from "~/types";

const { getServiceDefinitions, getServiceDefinitionById, isLoading } = useServiceDefinitions();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ServiceDefinition[]>([]);
const keyword = ref<string>("");

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const serviceDefinitions = await getServiceDefinitions(0, 100000000);
    data.value = serviceDefinitions;
  } catch (err: any) {
    console.error("Error fetching service definitions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("serviceDefinitionsData", async () => {
  await fetchData();
});

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getServiceDefinitionById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching service definitions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};
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
    <NuxtLink to="/serviceDefinitions/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Service Definition</UiButton
      >
    </NuxtLink>
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
