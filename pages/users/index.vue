<script setup lang="ts">
import { ref, onMounted } from "vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { useUsers } from "~/composables/useUsers";
import type { User } from "~/types";
import { columns as tableColumns } from "~/components/users/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";


const { getUsers, searchUsers,  } = useUsers();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<User[]>([]);
const keyword = ref<string>("");

const fetchSystemUserData = async () => {
  try {
    isLoading.value = true;
    const users = await getUsers(0, 1000000000); // Call your API function to fetch roles
    data.value = users.filter(user => {
      if(!user.staff && !user.operator && !user.customer){
        return user
      }
    })
    // Sort integrations by name alphabetically, handling null values
    data.value = data.value.sort((a, b) => {
      // Handle cases where fullName might be null
      const nameA = a.login?.toLowerCase() || "";
      const nameB = b.login?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });
  } catch (err: any) {
    console.error("Error fetching users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const searchHandler = async () => {
  try {
    isLoading.value = true;
    data.value = await searchUsers(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSystemUserData();
});

const refetch = async () => {
  await fetchSystemUserData();
};

// Provide the refetch function
provide('refetchSystemUsers', refetch);

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
    <UiPermissionGuard :permission=PermissionConstants.CREATE_USER >
    <NuxtLink to="/users/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        User</UiButton
      >
    </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <!-- <CustomersDataTableSearchbar :table="table" /> -->
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search by email or phone ( starting from 9 ) ..."
            class="md:w-[100px] lg:w-[300px] placeholder:text-xs"
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

  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
