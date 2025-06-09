<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/staffs/assignments/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { StaffAssignment } from "~/types";
import { getIdFromPath } from "~/lib/utils";

// const { getStaffAssignments, getStaffAssignmentById,getStaffAssignmentByStaffId, isLoading } = useStaffAssignments();
const {getCurrentAssignments} = useProfile()
const loading = ref(false);
const isError = ref(false);
const data = ref<StaffAssignment[]>([]);
const keyword = ref<string>("");
const staffId = ref<string>("")

staffId.value = getIdFromPath()
console.log("staff id: ", staffId.value)

const fetchData = async () => {
  try {
    loading.value = true;
    const staffAssignments = await getCurrentAssignments();
    // Sort integrations by name alphabetically
    data.value = staffAssignments?.sort((a:StaffAssignment, b:StaffAssignment) => {
      if (a?.staff?.firstname && b?.staff?.firstname) {
        return a?.staff?.firstname.toLowerCase().localeCompare(b?.staff?.firstname.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching staff assignments:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("staffsData", async () => {
  await fetchData();
});

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
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
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
