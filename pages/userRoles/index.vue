<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "~/components/DataTable.vue";
import { columns, type UserRole } from "~/components/userRoles/columns";

const data = ref<UserRole[]>([]);

async function getData(): Promise<UserRole[]> {
  // Fetch data from your API here.
  return [
    {
      roleId: "1",
      roleName: "Super Admin",
      roleDescription:
        "This user has all the permissions available in the system. ",
      legalEntity: ["Model Bank"],
      status: "Active",
      systemPermissions: [
        {
          ["Legal Entity"]: "Model Bank",
          ["Permissions"]: 68,
        },
      ],
      customerAccess: [{}],
    },
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div v-if="data.length > 0" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiButton class="w-fit self-end px-5"
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>New User
      Role</UiButton
    >
    <DataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by User Role Name"
              :model-value="(table?.getColumn('roleName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('roleName')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
          <DataTableViewOptions :table="table" />
        </div>
      </template>
    </DataTable>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <Loading />
  </div>
</template>
