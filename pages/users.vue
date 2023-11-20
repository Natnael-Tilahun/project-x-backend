<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataTable from "~/components/DataTable.vue";
import { columns, type User } from "~/components/users/columns";

const data = ref<User[]>([]);

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      phone: +251933654654,
      email: "m@example.com",
      amount: 100,
      accounts: [1000179835555, 10003333444444],
    },
    // ...
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div v-if="data.length > 0" class="py-10 mx-auto">
    <DataTable :columns="columns" :data="data" />
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <Loading />
  </div>
</template>
