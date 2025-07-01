<script lang="ts" setup>
const openItems = ref("");
import { ref } from "vue";
// import { columns } from "~/components/operations/columns";
import type { ApiOperation, Local } from "~/types";
import { columns as tableColumns } from "~/components/operations/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const { getIntegrationOperations } = useIntegrations();

const isLoading = ref(false);
const isError = ref(false);
const integrationId = ref<string>("");
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

if (props?.apiIntegrationIdProps) {
  integrationId.value = props?.apiIntegrationIdProps;
}

const getApiOperationsData = async () => {
  try {
    isLoading.value = true;
    const apiOperations = await getIntegrationOperations(integrationId.value);
    data.value = apiOperations;
    console.log("data::", data.value);
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

const refetch = async () => {
  await getApiOperationsData();
};


// Provide the refetch function
provide('refetchApiOperations', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard :permission="PermissionConstants.CREATE_API_OPERATION" >
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
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data || []">
      <template v-slot:toolbar="{ table }"> </template>
    </UiDataTable>
  </div>
  <div v-if="isError">
    <ErrorMessage :retry="getApiOperationsData" title="Something went wrong." />
  </div>
</template>
