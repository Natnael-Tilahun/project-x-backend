<script lang="ts" setup>
import {
  columns,
  type CustomerEnroll,
} from "~/components/customerEnroll/columns";
import DataTable from "~/components/DataTable.vue";

const data = ref<CustomerEnroll[]>([]);

async function getData(): Promise<CustomerEnroll[]> {
  // Fetch data from your API here.
  return [
    {
      customerId: "728ed52f",
      customerName: "Abebe Kebede",
      service: "Corporate Online banking",
      roll: "Administrator",
    },
    {
      customerId: "728ed52f",
      customerName: "Abebe Kebede",
      service: "Corporate Online banking",
      roll: "Administrator",
    },
    {
      customerId: "728ed52f",
      customerName: "Abebe Kebede",
      service: "Corporate Online banking",
      roll: "Administrator",
    },
    // ...
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div class="flex flex-col gap-5 items-center h-screen p-0 bg-secondary">
    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[0.5px] rounded-md"
    >
      <div class="flex items-center justify-between">
        <h1 class="md:text-xl items-center text-gray-500">
          User: <span>Abebe Kebede</span>
        </h1>
        <UiButton variant="outline" class="p-6 rounded-lg"
          >Add Customer ID</UiButton
        >
      </div>

      <div class="flex flex-col space-y-4">
        <DataTable :columns="columns" :data="data">
          <!-- <template v-slot:toolbar="{ table }">
            <CustomerDataTableSearchbar :table="table" />
          </template> -->
        </DataTable>
      </div>
      <div class="flex justify-between">
        <UiButton variant="outline">Cancel</UiButton>
        <UiButton>Enroll</UiButton>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
