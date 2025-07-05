<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Role } from "~/types";
import { columns as tableColumns } from "~/components/merchantRoles/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getMerchantOperatorRoles } = useMerchantRoles();
const isLoading = ref();
const isError = ref(false);
const data = ref<Role[]>([]);
const { pageNumber } = usePagesInfoStore();

const fetchMerchantRoleData = async () => {
  try {
    isLoading.value = true;
     const response = await getMerchantOperatorRoles(); // Call your API function to fetch roles
     data.value = response.content
  } catch (err) {
    console.error("Error fetching merchant roles:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMerchantRoleData();
});

const refetch = async () => {
  await fetchMerchantRoleData();
};

// Provide the refetch function
provide('refetchMerchantRoles', refetch);

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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_MERCHANT_OPERATOR_ROLE >
    <NuxtLink to="/merchantRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add New Merchant Operator
        Role</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Role Name"
              :model-value="(table?.getColumn('name')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('name')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>

  <!-- <div v-else-if="data && !isError ">
    <UiNoResultFound title="Sorry, No role found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
