<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/staffAssignments/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { StaffAssignment } from "~/types";

const { getStaffAssignments, getStaffAssignmentById, isLoading } = useStaffAssignments();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<StaffAssignment[]>([]);
const keyword = ref<string>("");

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const staffAssignments = await getStaffAssignments(0, 100000000);
    // Sort integrations by name alphabetically
    data.value = staffAssignments.sort((a:StaffAssignment, b:StaffAssignment) => {
      if (a?.staff?.firstname && b?.staff?.firstname) {
        return a?.staff?.firstname.toLowerCase().localeCompare(b?.staff?.firstname.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching staff assignments:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("staffsData", async () => {
  await fetchData();
});

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getStaffAssignmentById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching staff assignments:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard permission="CREATE_STAFF_ASSIGNMENTS" >
    <NuxtLink to="/staffAssignments/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Staff</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search by staff id"
            class="md:w-[100px] lg:w-[300px]"
            v-model="keyword"
          />
          <UiButton @click="searchHandler">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
