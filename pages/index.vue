<script setup lang="ts">
import DashboardDateRangePicker from "~/components/dashboard/DateRangePicker.vue";
</script>

<template>
  <UiTabs default-value="overview" class="space-y-12">
    <div
      class="flex flex-col lg:flex-row gap-5 space-y-0justify-start lg:justify-between"
    >
      <UiTabsList class="md:justify-start w-fit">
        <UiTabsTrigger value="overview"> Overview </UiTabsTrigger>
        <UiTabsTrigger value="analytics" disabled> Analytics </UiTabsTrigger>
        <UiTabsTrigger value="reports" disabled> Reports </UiTabsTrigger>
        <UiTabsTrigger value="notifications" disabled>
          Notifications
        </UiTabsTrigger>
      </UiTabsList>
      <div class="flex items-center space-x-2 w-full md:w-fit">
        <DashboardDateRangePicker />
        <UiButton>Download</UiButton>
      </div>
    </div>

    <!-- Overview tab component -->
    <UiTabsContent value="overview" class="space-y-4">
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <UiCard>
          <UiCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <UiCardTitle class="text-sm font-medium"> Messages </UiCardTitle>
            <Icon
              name="material-symbols:chat"
              size="18"
              class="text-muted-foreground"
            ></Icon>
          </UiCardHeader>
          <UiCardContent>
            <div class="text-2xl font-bold">+450</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
          </UiCardContent>
        </UiCard>
        <UiCard>
          <UiCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <UiCardTitle class="text-sm font-medium">
              Subscriptions
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </UiCardHeader>
          <UiCardContent>
            <div class="text-2xl font-bold">+2350</div>
            <p class="text-xs text-muted-foreground">+180.1% from last month</p>
          </UiCardContent>
        </UiCard>
        <UiCard>
          <UiCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <UiCardTitle class="text-sm font-medium"> Merchants </UiCardTitle>
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </UiCardHeader>
          <UiCardContent>
            <div class="text-2xl font-bold">+12,234</div>
            <p class="text-xs text-muted-foreground">+19% from last month</p>
          </UiCardContent>
        </UiCard>
        <UiCard>
          <UiCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <UiCardTitle class="text-sm font-medium"> Active Now </UiCardTitle>
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
            <div class="text-2xl font-bold">+573</div>
            <p class="text-xs text-muted-foreground">+201 since last hour</p>
          </UiCardContent>
        </UiCard>
      </div>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <UiCard class="col-span-4">
          <UiCardHeader>
            <UiCardTitle>Overview</UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="pl-2">
            <DashboardOverview />
          </UiCardContent>
        </UiCard>
        <UiCard class="col-span-3">
          <UiCardHeader>
            <UiCardTitle>Recent Customers</UiCardTitle>
            <UiCardDescription>
              You got 265 customers this month.
            </UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <DashboardRecentSales />
          </UiCardContent>
        </UiCard>
      </div>
    </UiTabsContent>
  </UiTabs>
</template>
