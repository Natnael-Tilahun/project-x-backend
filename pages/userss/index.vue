<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns, type User } from "~/components/users/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";

const { getUsers, isLoading } = useUsers();
const loading = ref(isLoading.value);
const isError = ref(false);

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
  // data.value = await getData();

  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getUsers(); // Call your API function to fetch profile
    console.log("Users data; ", data.value);
    // formData.value = profileData; // Store the profile data in a reactive variable
  } catch (err) {
    console.error("Error fetching users:", err);
    isError.value = true;
    // Handle error fetching profile data
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
});
</script>

<template>
  <div
    v-if="loading"
    class="py-10 flex bg-background rounded-xl h-[500px] max-h-screen justify-center items-center"
  >
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError && data?.length > 0"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
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
  <div v-else-if="data && !isError && data?.length < 0">
    <UiNoResultFound title="Sorry, No user found." />
  </div>
  <div v-else>
    <ErrorMessage title="Something went wrong." />
  </div>
</template>
