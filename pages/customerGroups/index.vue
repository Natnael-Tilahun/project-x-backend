<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { CustomerGroup, Staff } from "~/types";
import { columns as tableColumns } from "~/components/customerGroups/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getCustomerGroups, getCustomerGroupById } = useCustomerGroups();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<CustomerGroup[]>([]);
const keyword = ref<string>("");

const fetchCustomerGroupData = async () => {
  try {
    isLoading.value = true;
    const staffs = await getCustomerGroups(0, 100000000);
    // Sort integrations by name alphabetically
    data.value = staffs?.sort((a:CustomerGroup, b:CustomerGroup) => {
      if (a.groupName && b.groupName) {
        return a.groupName.toLowerCase().localeCompare(b.groupName.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching customer groups:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchCustomerGroupData();
};

onMounted(() => {
  fetchCustomerGroupData();
});


const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value[0] = await getCustomerGroupById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching customer groups:", err);
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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_STAFF >
    <NuxtLink to="/customerGroups/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Customer Group</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
              placeholder="Filter by group name"
              :model-value="(table?.getColumn('groupName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('groupName')
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
