<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { CustomerGroupMember } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/customerGroups/members/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const {getCustomerGroupMemebersByGroupId } = useCustomerGroups();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<CustomerGroupMember[]>([]);
const groupId = ref<string>("")
groupId.value = getIdFromPath()

const fetchStaffAssignmentsData = async () => {
  try {
    isLoading.value = true;
    const groupMemebers = await getCustomerGroupMemebersByGroupId(groupId.value, 0, 10000000);
    // Sort integrations by name alphabetically
    data.value = groupMemebers?.sort((a:CustomerGroupMember, b:CustomerGroupMember) => {
      if (a?.customer?.firstname && b?.customer?.firstname) {
        return a?.customer?.firstname.toLowerCase().localeCompare(b?.customer?.firstname.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching group members:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  isError.value = false
  await fetchStaffAssignmentsData();
};

onMounted(() => {
  fetchStaffAssignmentsData();
});

// Provide the refetch function
provide('refetchGroupMemebers', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <UiPermissionGuard :permission="PermissionConstants.CREATE_STAFF_ASSIGNMENT" >
    <NuxtLink to="/members/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Add
        Group Member</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
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
