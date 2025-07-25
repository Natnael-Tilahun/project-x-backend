<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Office } from "~/types";
import { columns as tableColumns } from "~/components/offices/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getOffices, getOfficeById } = useOffice();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Office[]>([]);
const keyword = ref<string>("");

const fetchOfficesData = async () => {
  try {
    isLoading.value = true;
    const offices = await getOffices(0, 100000000);
    // Sort integrations by name alphabetically
    data.value = offices.sort((a:Office, b:Office) => {
      if (a.name && b.name) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching offices:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchOfficesData();
};

onMounted(() => {
  fetchOfficesData();
});


const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value[0] = await getOfficeById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching offices:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Provide the refetch function
provide('refetchStaffs', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_OFFICE >
    <NuxtLink to="/offices/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Office</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
              placeholder="Filter by office name"
              :model-value="(table?.getColumn('name')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('name')
                  ?.setFilterValue($event.target.value)
              "
            />
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
