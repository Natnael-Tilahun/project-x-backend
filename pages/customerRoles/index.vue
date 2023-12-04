<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "~/components/DataTable.vue";
import { columns, type CustomerRole } from "~/components/customerRoles/columns";

const data = ref<CustomerRole[]>([]);

async function getData(): Promise<CustomerRole[]> {
  // Fetch data from your API here.
  return [
    {
      rollName: "Administrator",
      rollType: "Business Banking",
      businessType: ["Sole Proprietor, Partnership", "Trust"],
      customers: 40,
      status: "Active",
    },
    {
      rollName: "Administrator",
      rollType: "Business Banking",
      businessType: ["Sole Proprietor, Partnership", "Trust"],
      customers: 40,
      status: "Active",
    },
    {
      rollName: "Authorizer",
      rollType: "Business Banking",
      businessType: ["Partnership", "Unincorporated Association"],
      customers: 2,
      status: "Active",
    },
    {
      rollName: "Authorizer",
      rollType: "Business Banking",
      businessType: "-",
      customers: 0,
      status: "Active",
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
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>New
      User</UiButton
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
