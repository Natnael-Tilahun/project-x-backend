<script lang="ts" setup>
const openItems = ref("");
import { ref } from "vue";
import { columns } from "~/components/operations/columns";

const route = useRoute();
const { getOperations } = useOperations();

const isLoading = ref(false);
const isDeleting = ref(false);
const isError = ref(false);
const operationId = ref<string>("");
const data = ref<ApiOperation[]>([]);
const locals = ref<Local[]>([
  {
    defaultLanguageCode: "en",
    localName: "English",
  },
  {
    defaultLanguageCode: "amh",
    localName: "Amharic",
  },
  {
    defaultLanguageCode: "orm",
    localName: "Oromo",
  },
]);
const selectedLocals = ref<Local[]>([]);
const props = defineProps<{
  apiIntegrationIdProps?: string;
}>();

const getApiOperationsData = async () => {
  try {
    isLoading.value = true;
    const apiOperations = await getOperations();
    data.value = apiOperations.filter(
      (operation) =>
        operation?.apiIntegration?.id === props?.apiIntegrationIdProps
    );
  } catch (err) {
    console.error("Error fetching api operations:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getApiOperationsData();
});
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiButton
      @click="
        navigateTo({
          path: route.path,
          query: {
            activeTab: 'newOperation',
          },
        })
      "
      class="w-fit self-end px-5"
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Configure
      New</UiButton
    >
    <UiDataTable :columns="columns" :data="data || []">
      <template v-slot:toolbar="{ table }"> </template>
    </UiDataTable>
  </div>
  <div v-if="isError">
    <ErrorMessage :retry="getApiOperationsData" title="Something went wrong." />
  </div>
</template>
