<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { columns as tableColumns } from "~/components/bankingServices/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const { 
  page,
  size,
  sort,
  offices: data,
  total,
  loading: isLoading,
  error: isError,
  fetchOffices: fetchData,
  onPageChange,
  onSizeChange,
  onSortChange, getBankingServiceById } = useBankingServices();

const keyword = ref<string>("");

const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value[0] = await getBankingServiceById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching banking services:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

provide('refetchBankingServices', fetchData);


const columns = computed(() => tableColumns(fetchData));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div v-else-if="data && !isError" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard :permission="PermissionConstants.CREATE_BANKING_SERVICE">
      <NuxtLink to="/bankingServices/new" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5">
          <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
          Banking Service
        </UiButton>
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput placeholder="Filter by service Name"
              :model-value="(table?.getColumn('serviceName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]" @input="
                table?.getColumn('serviceName')?.setFilterValue($event.target.value)
                " />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    <ServerPagination :page="page" :size="size" :total="total" :on-page-change="onPageChange"
      :on-size-change="onSizeChange" />
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
