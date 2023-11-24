<script setup lang="ts">
import { ref, onMounted } from "vue";
import CustomerDataTableToolbar from "~/components/CustomerDataTableSearchbar.vue.js";
import DataTable from "~/components/DataTable.vue";
import { columns, type Customer } from "~/components/customers/columns";

const data = ref<Customer[]>([]);

async function getData(): Promise<Customer[]> {
  // Fetch data from your API here.
  return [
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "abebekebede@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "hh448ed52f",
      customerPhone: "923334455",
      userId: "66ffd52fadfasd",
      email: "dsdfs@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Gov Id",
      status: "Active",
    },
    {
      customerId: "55ddd52f",
      customerPhone: "911223344",
      userId: "55eed52fadfasd",
      email: "dsdsd@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Driver License",
      status: "Active",
    },
    {
      customerId: "gg33d52f",
      customerPhone: "944554433",
      userId: "728ed52fadfasd",
      email: "ggdfd@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "UnEnrolled",
    },
    {
      customerId: "728ed52f",
      customerPhone: "974635322",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Locked",
    },
    {
      customerId: "728ed52f",
      customerPhone: "923453322",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "New",
    },
    {
      customerId: "728ed52f",
      customerPhone: "964534222",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Suspended",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "processing",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    {
      customerId: "728ed52f",
      customerPhone: "933665566",
      userId: "728ed52fadfasd",
      email: "m@example.com",
      customerName: "Abebe Kebede",
      accountNumber: "1000433433234334",
      identification: "Passport",
      status: "Active",
    },
    // ...
  ];
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="data.length > 0" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiButton class="w-fit self-end px-5"
      ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
      Customer</UiButton
    >

    <DataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <CustomerDataTableToolbar :table="table" />
      </template>
    </DataTable>
  </div>
  <div v-else class="py-10 flex justify-center w-full">
    <Loading />
  </div>
</template>
