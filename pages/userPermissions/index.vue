<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "../../components/userPermissions/columns";
import { usePermissions } from "~/composables/usePermissions";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Permission } from "~/types";
import { PermissionCategory } from "~/global-types";

const { getPermissions, isLoading } = usePermissions();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Permission[]>([]);
const staffPermissionsData = ref<Permission[]>([]);
const customerPermissionsData = ref<Permission[]>([]);
const systemPermissionsData = ref<Permission[]>([]);
const openItems = ref("staffPermissions");

const refetch = async () => {
  await fetchData();
};

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const permissions = await getPermissions(0,100000);
    data.value = permissions.sort((a: Permission, b: Permission) =>
      a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
    );
    staffPermissionsData.value = data.value.filter(permission => permission.category == PermissionCategory.STAFF)
    customerPermissionsData.value = data.value.filter(permission => permission.category == PermissionCategory.CUSTOMER)
    systemPermissionsData.value = data.value.filter(permission => permission.category == PermissionCategory.SYSTEM)
  } catch (err) {
    console.error("Error fetching users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

await useAsyncData("permissionsData", async () => {
  await fetchData();
});
</script>
<template>
  <div v-if="isLoading" class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && data?.length > 0"
    class="py-4 flex flex-col space-y-10 mx-auto"
  >
  <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="staffPermissions"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Staff Permissions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="customerPermissions"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Customer Permissions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="systemPermissions"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          System Permissions
        </UiTabsTrigger>
        </UiTabsList>
        <UiTabsContent
        value="staffPermissions"
        class="text-base bg-background p-6 rounded-lg"
      >
    <UiDataTable :columns="columns" :data="staffPermissionsData">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by staff permission code"
              :model-value="(table?.getColumn('code')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('code')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    </UiTabsContent>
    <UiTabsContent
        value="customerPermissions"
        class="text-base bg-background p-6 rounded-lg"
      >
       <!-- <UiPermissionGuard permission="CREATE_PERMISSIONS" >
    <NuxtLink to="/userPermissions/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        User Permission</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard> -->
    <UiDataTable :columns="columns" :data="customerPermissionsData">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by customer permission code"
              :model-value="(table?.getColumn('code')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('code')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    </UiTabsContent>
    <UiTabsContent
        value="systemPermissions"
        class="text-base bg-background p-6 rounded-lg"
      >
    <UiDataTable :columns="columns" :data="systemPermissionsData">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by system permission code"
              :model-value="(table?.getColumn('code')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table?.getColumn('code')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
    </UiTabsContent>
        </UiTabs>
  </div>
  <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No permission found." />
  </div>
  <div v-else>
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>

<style lang="postcss" scoped></style>
