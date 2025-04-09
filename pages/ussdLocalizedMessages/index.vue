<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/ussdLocalizedMessages/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { LocalizedDefaultMessage } from "~/types";

const { getUssdLocalizedDefaultMessages, isLoading } = useUssdLocalizedDefaultMessage();
const keyword = ref<string>("");
const data = ref<LocalizedDefaultMessage[]>([]);
const loading = ref(isLoading.value);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}

const getUssdLocalizedDefaultMessagesData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const ussdLocalizedDefaultMessages = await getUssdLocalizedDefaultMessages(0, 100);
    // Sort integrations by name alphabetically
    data.value = ussdLocalizedDefaultMessages.sort((a, b) =>
      a.message.toLowerCase().localeCompare(b.message.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching ussd localized default messages:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("ussdLocalizedDefaultMessagesData", async () => {
  await getUssdLocalizedDefaultMessagesData();
});

const refetch = async () => {
  await getUssdLocalizedDefaultMessagesData();
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
    <NuxtLink to="/ussdLocalizedMessages/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
        >Create New Localized Default Message</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by message"
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
