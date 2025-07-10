<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { MerchantOperators, StaffAssignment } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { columns as tableColumns } from "~/components/merchants/operators/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const {getStaffAssignmentByStaffId } = useStaffAssignments();
const {getMerchantOperators} = useMerchantOperators()
const route = useRoute();
const fullPath = ref(route.path);
const isLoading = ref(false);
const isError = ref(false);
const data = ref<MerchantOperators[]>([]);
const merchantId = ref<string>("")
merchantId.value = getIdFromPath()

const fetchMerchantOperatorsData = async () => {
  try {
    isLoading.value = true;
    const merchantOperators = await getMerchantOperators();
    // Sort integrations by name alphabetically
    data.value = merchantOperators?.content?.sort((a:MerchantOperators, b:MerchantOperators) => {
      if (a?.fullName && b?.fullName) {
        return a?.fullName.toLowerCase().localeCompare(b?.fullName.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching merchant operators:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchMerchantOperatorsData();
};

onMounted(() => {
    fetchMerchantOperatorsData();
});

// Provide the refetch function
provide('refetchMerchantOperators', refetch);

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
    <NuxtLink :to="`${fullPath}?activeTab=newOperator`" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        New Operator</UiButton
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
