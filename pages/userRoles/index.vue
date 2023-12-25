<script setup lang="ts">
import { ref, onMounted } from "vue";
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
    {
      roleId: "2",
      roleName: "Front Line Staff",
      roleDescription:
        "This role has minimal permissions that help the users perform the dedicated tasks in Spotlight. Branch members who want to support members with Online and Mobile banking app can also be associated with this role",
      legalEntity: ["Model Bank"],
      status: "Active",
      systemPermissions: [
        {
          ["Legal Entity"]: "Model Bank",
          ["Permissions"]: 8,
        },
      ],
      customerAccess: [{}],
    },
    {
      roleId: "3",
      roleName: "Operations",
      roleDescription:
        "This role can manage the various services, operations and entitlements provided by the bank/CU",
      legalEntity: ["Model Bank"],
      status: "Active",
      systemPermissions: [
        {
          ["Legal Entity"]: "Model Bank",
          ["Permissions"]: 18,
        },
      ],
      customerAccess: [{}],
    },
    {
      roleId: "4",
      roleName: "Manager",
      roleDescription:
        "This role is similar to a front line staff admin but with more privileges to control what kind of information can be updated by a front line staff. ",
      legalEntity: ["Model Bank"],
      status: "Active",
      systemPermissions: [
        {
          ["Legal Entity"]: "Model Bank",
          ["Permissions"]: 18,
        },
      ],
      customerAccess: [{}],
    },
    {
      roleId: "5",
      roleName: "Business",
      roleDescription:
        " This role is for business users who want to view Spotlight capabilities, review data but not make major changes. These users can also send messages to customers and view/update their details",
      legalEntity: ["Model Bank"],
      status: "Active",
      systemPermissions: [
        {
          ["Legal Entity"]: "Model Bank",
          ["Permissions"]: 18,
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
  <div v-if="data.length > 0" class="py-4 flex flex-col space-y-10 mx-auto">
    <NuxtLink to="/userRoles/new" class="w-fit self-end"
      ><UiButton
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        User Role</UiButton
      >
    </NuxtLink>
    <UiDataTable :columns="columns" :data="data">
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
    </UiDataTable>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
</template>
