<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/defaultMessages/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { DefaultMessage } from "~/types";

const { getUssdDefaultMessages, isLoading } = useUssdDefaultMessage();
const keyword = ref<string>("");
const data = ref<DefaultMessage[]>([]);
const loading = ref(isLoading.value);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const getUssdDefaultMessagesData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const ussdDefaultMessages = await getUssdDefaultMessages(0, 100);
    // Sort integrations by name alphabetically
    data.value = ussdDefaultMessages.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching ussd default messages:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("ussdDefaultMessagesData", async () => {
  await getUssdDefaultMessagesData();
});

const refetch = async () => {
  await getUssdDefaultMessagesData();
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
    <UiPermissionGuard permission="CREATE_USSD_DEFAULT_MESSAGES">
      <NuxtLink to="/ussdDefaultMessages/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5"
          ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
          >Create New Default Message</UiButton
        >
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Title"
              :model-value="(table?.getColumn('title')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('title')?.setFilterValue($event.target.value)
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
