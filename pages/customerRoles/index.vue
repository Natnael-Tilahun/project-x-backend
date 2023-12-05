<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "~/components/DataTable.vue";
import { columns, type CustomerRole } from "~/components/customerRoles/columns";

const data = ref<CustomerRole[]>([]);

async function getData(): Promise<CustomerRole[]> {
  // Fetch data from your API here.
  return [
    {
      rollId: "1",
      rollName: "Administrator",
      rollType: "Business Banking",
      businessType: ["Sole Proprietor, Partnership", "Trust"],
      customers: 40,
      status: "Active",
      eAgreement: "Not Required",
      defaultService: "Sole Proprietor",
      roleDescription:
        "This business users have the highest level of access to all the functions, can create, authorize transactions & manage access of other users(register / suspend / activate users, limit access to accounts & functions, set transaction limits)",
      features: [
        {
          "Check Management": {
            actions: "Check management add stop check",
            description: "Check management add stop check request",
            limits: {
              "Per Transaction Limit": "10000",
              "Daily Transation Limit": "30000",
              "Weekly Transaction Limit": "100000",
            },
          },
        },
      ],
    },
    {
      rollId: "2",
      rollName: "Administrator",
      rollType: "Business Banking",
      businessType: ["Sole Proprietor, Partnership", "Trust"],
      customers: 40,
      status: "Active",
      eAgreement: "Not Required",
      defaultService: "Sole Proprietor",
      roleDescription:
        "This business users have the highest level of access to all the functions, can create, authorize transactions & manage access of other users(register / suspend / activate users, limit access to accounts & functions, set transaction limits)",
      features: [
        {
          "Check Management": {
            actions: "Check management add stop check",
            description: "Check management add stop check request",
            limits: {
              "Per Transaction Limit": "10000",
              "Daily Transation Limit": "30000",
              "Weekly Transaction Limit": "100000",
            },
            status: "Active",
          },
        },
      ],
    },
    {
      rollId: "3",
      rollName: "Authorizer",
      rollType: "Business Banking",
      businessType: ["Partnership", "Unincorporated Association"],
      customers: 2,
      status: "Active",
      eAgreement: "Not Required",
      defaultService: "Sole Proprietor",
      roleDescription:
        "This business users have the highest level of access to all the functions, can create, authorize transactions & manage access of other users(register / suspend / activate users, limit access to accounts & functions, set transaction limits)",
      features: [
        {
          checkManagement: {
            actions: "Check management add stop check",
            description: "Check management add stop check request",
            limits: {
              "Per Transaction Limit": "10000",
              "Daily Transation Limit": "30000",
              "Weekly Transaction Limit": "100000",
            },
            status: "Suspended",
          },
        },
      ],
    },
    {
      rollId: "4",
      rollName: "Authorizer",
      rollType: "Business Banking",
      businessType: "-",
      customers: 0,
      status: "Active",
      eAgreement: "Not Required",
      defaultService: "Sole Proprietor",
      roleDescription:
        "This business users have the highest level of access to all the functions, can create, authorize transactions & manage access of other users(register / suspend / activate users, limit access to accounts & functions, set transaction limits)",
      features: [
        {
          checkManagement: {
            actions: "Check management add stop check",
            description: "Check management add stop check request",
            limits: {
              "Per Transaction Limit": "10000",
              "Daily Transation Limit": "30000",
              "Weekly Transaction Limit": "100000",
            },
            status: "Active",
          },
        },
      ],
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
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
      Customer Role</UiButton
    >
    <DataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <DataTableToolbar :table="table" /> -->
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <UiInput
              placeholder="Filter by Customer Roll Name"
              :model-value="(table?.getColumn('rollName')?.getFilterValue() as string) ?? ''"
              class="h-8 w-[150px] lg:w-[250px]"
              @input="
                table
                  ?.getColumn('rollName')
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
