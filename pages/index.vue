<script setup lang="ts">
import DashboardDateRangePicker from "~/components/dashboard/DateRangePicker.vue";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Customer, Integration, Merchant, Staff } from "~/types";

const authStore = useAuthStore(); // Make sure this is your Pinia auth store instance
const { getStaffs } = useStaffs();
const { getMerchants } = useMerchants();
const { getCustomers } = useCustomers();
const { getIntegrations } = useIntegrations();

const isLoading = ref(true);
const isError = ref(false);
const staffData = ref<Staff[]>([]);
const merchantData = ref<Merchant[]>([]);
const customerData = ref<Customer[]>([]);
const integrationData = ref<Integration[]>([]);
const staffNumber = computed(() => staffData.value.length);
const merchantNumber = computed(() => merchantData.value.length);
const customerNumber = computed(() => customerData.value.length);
const integrationNumber = computed(() => integrationData.value.length);

const fetchData = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    [
      staffData.value,
      merchantData.value,
      customerData.value,
      integrationData.value,
    ] = await Promise.all([
      getStaffs().catch(() => []),
      getMerchants().catch(() => []),
      getCustomers().catch(() => []),
      getIntegrations().catch(() => []),
    ]);
    isError.value = false;
  } catch (error) {
    isError.value = true;
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

await useAsyncData("dashboardData", async () => {
  await fetchData();
});

const refetch = async () => {
  await fetchData();
};

watch(
  customerData,
  (newData) => {
    console.log("Customer Data in index.vue:", newData);
  },
  { immediate: true }
);
</script>

<template>
  <UiTabs default-value="overview" class="space-y-6 dark:bg-dark-background">
    <h1 class="text-xl font-bold">Welcome {{ authStore.username }}</h1>
    <div
      class="flex flex-col lg:flex-row gap-5 space-y-0justify-start lg:justify-between"
    >
      <UiTabsList class="md:justify-start w-full bg-slate-200 dark:bg-gray-800">
        <UiTabsTrigger value="overview"> Overview </UiTabsTrigger>
        <!-- <UiTabsTrigger value="analytics" disabled> Analytics </UiTabsTrigger>
        <UiTabsTrigger value="reports" disabled> Reports </UiTabsTrigger>
        <UiTabsTrigger value="notifications" disabled>
          Notifications
        </UiTabsTrigger> -->
      </UiTabsList>
      <!-- <div class="flex items-center space-x-2 w-full md:w-fit">
        <DashboardDateRangePicker />
        <UiButton>Download</UiButton>
      </div> -->
    </div>

    <!-- Overview tab component -->
    <UiTabsContent value="overview" class="space-y-6">
      <div
        class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        v-if="isLoading"
      >
        <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
          <UiSkeleton class="h-32 w-10 bg-slate-300" />
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
        </div>
        <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
          <UiSkeleton class="h-32 w-10 bg-slate-300" />
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
        </div>
        <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
          <UiSkeleton class="h-32 w-10 bg-slate-300" />
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
        </div>
        <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
          <UiSkeleton class="h-32 w-10 bg-slate-300" />
          <UiSkeleton class="h-32 w-20 bg-slate-300" />
        </div>
      </div>

      <div v-else-if="isError">
        <ErrorMessage :retry="refetch" title="Something went wrong." />
      </div>

      <div
        v-else-if="
          !isLoading &&
          !isError &&
          customerData &&
          merchantData &&
          staffData &&
          integrationData
        "
        class="space-y-6"
      >
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <UiCard>
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-sm font-medium"> Customers </UiCardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </UiCardHeader>
            <UiCardContent>
              <div class="text-2xl font-bold">{{ customerNumber }}</div>
              <p class="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </UiCardContent>
          </UiCard>
          <UiCard>
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-sm font-medium"> Merchants </UiCardTitle>
              <Icon
                name="carbon:customer-service"
                size="18"
                class="text-muted-foreground"
              ></Icon>
            </UiCardHeader>
            <UiCardContent>
              <div class="text-2xl font-bold">{{ merchantNumber }}</div>
              <p class="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </UiCardContent>
          </UiCard>
          <UiCard>
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-sm font-medium"> Staffs </UiCardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </UiCardHeader>
            <UiCardContent>
              <div class="text-2xl font-bold">{{ staffNumber }}</div>
              <p class="text-xs text-muted-foreground">+19% from last month</p>
            </UiCardContent>
          </UiCard>
          <UiCard>
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-sm font-medium">
                Integrations
              </UiCardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </UiCardHeader>
            <UiCardContent>
              <div class="text-2xl font-bold">{{ integrationNumber }}</div>
              <p class="text-xs text-muted-foreground">+10 since last month</p>
            </UiCardContent>
          </UiCard>
        </div>
        <div>
          <UiCard class="col-span-4">
            <UiCardHeader>
              <UiCardTitle>Overview</UiCardTitle>
            </UiCardHeader>
            <UiCardContent class="pl-2">
              <DashboardOverview />
            </UiCardContent>
          </UiCard>
        </div>
      </div>
    </UiTabsContent>
  </UiTabs>
</template>
