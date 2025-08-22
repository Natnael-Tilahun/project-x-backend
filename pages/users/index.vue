<script setup lang="ts">
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { useUsers } from "~/composables/useUsers";
import { columns as tableColumns } from "~/components/users/columns";
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const {
  page,
  size,
  sort,
  users: data,
  total,
  loading: isLoading,
  error: isError,
  fetchUsers: fetchData,
  onPageChange,
  onSizeChange,
  onSortChange,
  onSearchChange,
} = useUsers();

const columns = computed(() => tableColumns(fetchData));

const keyword = ref<string>("");
const handleSearch = () => onSearchChange(keyword.value);
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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_USER >
    <NuxtLink to="/users/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        User</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search by email or phone ( starting from 9 ) ..."
            class="md:w-[100px] lg:w-[300px] placeholder:text-xs"
            v-model="keyword"
            @keyup.enter="handleSearch"
          />
          <UiButton @click="handleSearch">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </template>
    </UiDataTable>
    <ServerPagination
      :page="page"
      :size="size"
      :total="total"
      :on-page-change="onPageChange"
      :on-size-change="onSizeChange"
    />
  </div>

  <div v-if="isError">
    <ErrorMessage :retry="fetchData" title="Something went wrong." />
  </div>
</template>
