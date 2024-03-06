<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  columns,
  type UserPermission,
} from "../../components/userPermissions/columns";

const data = ref<UserPermission[]>([]);

async function getData(): Promise<UserPermission[]> {
  // Fetch data from your API here.
  return [
    {
      permissionId: "1",
      permissionName: "Super Admin",
      permissionDescription:
        "This user has all the permissions available in the system. ",
      grouping: "Group A",
      legalEntity: ["Model Bank"],
      status: "Active",
    },
    {
      permissionId: "2",
      permissionName: "Front Line Staff",
      permissionDescription:
        "This role has minimal permissions that help the users perform the dedicated tasks in Spotlight. Branch members who want to support members with Online and Mobile banking app can also be associated with this role",
      grouping: "Group B",
      legalEntity: ["Model Bank"],
      status: "Active",
    },
    {
      permissionId: "3",
      permissionName: "Operations",
      permissionDescription:
        "This role can manage the various services, operations and entitlements provided by the bank/CU",
      grouping: "Group A",
      legalEntity: ["Model Bank"],
      status: "Active",
    },
    {
      permissionId: "4",
      permissionName: "Manager",
      permissionDescription:
        "This role is similar to a front line staff admin but with more privileges to control what kind of information can be updated by a front line staff. ",
      grouping: "Group B",
      legalEntity: ["Model Bank"],
      status: "Active",
    },
    {
      permissionId: "5",
      permissionName: "Business",
      permissionDescription:
        " This role is for business users who want to view Spotlight capabilities, review data but not make major changes. These users can also send messages to customers and view/update their details",
      grouping: "Group A",
      legalEntity: ["Model Bank"],
      status: "Active",
    },
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>
<template>
  <div v-if="data.length > 0" class="py-4 flex flex-col space-y-10 mx-auto">
    <NuxtLink to="/userPermissions/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        User Permission</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by User Permission Name"
              :model-value="(table?.getColumn('permissionName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('permissionName')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
</template>

<style lang="postcss" scoped></style>
