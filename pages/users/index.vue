<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns, type User } from "~/components/users/columns";

const data = ref<User[]>([]);

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      fullName: "Natnael Tilahun",
      userName: "Nhatty",
      email: "natnaeltilahun97@example.com",
      role: "admin",
      status: "Active",
    },
    {
      id: "728ed52f",
      fullName: "Natnael Tilahun",
      userName: "Nhatty",
      email: "abebekebede@example.com",
      role: "admin",
      status: "Active",
    },
    {
      id: "728ed52f",
      fullName: "Natnael Tilahun",
      userName: "Nhatty",
      email: "natnaeltilahun97@example.com",
      role: "admin",
      status: "New",
    },
    {
      id: "728ed52f",
      fullName: "Natnael Tilahun",
      userName: "Nhatty",
      email: "natnaeltilahun97@example.com",
      role: "admin",
      status: "Locked",
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
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <DataTableToolbar :table="table" />
      </template>
    </UiDataTable>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <UiLoading />
  </div>
</template>
