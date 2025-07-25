<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { toast } from "~/components/ui/toast";
import type { Charge } from "~/types";
import { columns as tableColumns } from "~/components/charges/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getCharges, refreshCoreCharges } = useCharges();
const isLoading = ref(false);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<Charge[]>([]);
const { pageNumber } = usePagesInfoStore();

const fetchChargesData = async () => {
  try {
    isLoading.value = true;
    data.value = await getCharges(0, 1000000); // Call your API function to fetch roles
  } catch (err) {
    console.error("Error fetching charges:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refreshCoreHandler = async () => {
  try {
    submitting.value = true;
    data.value = await refreshCoreCharges() || []; // Call your API function to fetch roles
    await fetchChargesData();
    toast({
      title: "Core refreshed successfully",
      description: "Charges have been refreshed.",
    });
  } catch (err) {
    console.error("Error refreshing charges:", err);
    toast({
      title: "Failed to refresh core",
      description: "Please try again later.",
    });
    isError.value = true;
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchChargesData();
});

const refetch = async () => {
  await fetchChargesData();
};

// Provide the refetch function
provide('refetchCharges', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
    <div class="flex space-x-4 self-end">
      <UiPermissionGuard :permission="PermissionConstants.CREATE_CHARGE">
        <NuxtLink to="/charges/new" class="w-fit self-end"
          ><UiButton
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Create New Charge</UiButton
          >
        </NuxtLink>
      </UiPermissionGuard>
      <UiButton @click="refreshCoreHandler" :disabled="submitting"
        ><Icon name="material-symbols:refresh" size="24" class="mr-2"></Icon>
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="submitting"
          class="mr-2 h-4 w-4 animate-spin"
        ></Icon>
        Refresh From Core</UiButton
      >
    </div>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by charge code"
              :model-value="(table?.getColumn('chargeCode')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('chargeCode')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-else-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
