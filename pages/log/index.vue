<script lang="ts" setup></script>

<template>
  <div class="flex flex-col items-center h-screen p-10 border-0">
    <UiTabs default-value="default-system-logs" class="space-y-0 w-full">
      <UiTabsList
        class="w-full bg-white flex justify-start py-7 px-0 border-[1px]"
      >
        <UiTabsTrigger
          value="default-system-logs"
          class="text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
        >
          Default System Logs
        </UiTabsTrigger>
        <UiTabsTrigger
          value="my-filtered-logs"
          class="text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
        >
          My Filtered Logs
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="default-system-logs"
        class="space-y-4 py-10 text-base border-[0px]"
      >
        <div class="flex gap-10">
          <NuxtLink
            to="/log/transactions"
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-8 gap-5 items-start justify-center"
          >
            <Icon
              name="icon-park-outline:transaction"
              class="h-20 w-40 self-start"
            ></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="text-xl font-medium">Transactions</h1>
              <p class="text-card-foreground">
                Details of all transactions initiated on the digiatl banking
                channle
              </p>
            </div>
          </NuxtLink>

          <div
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-8 gap-5 items-start justify-center"
          >
            <Icon name="mdi:console" class="h-20 w-40 self-start"></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="text-xl font-medium">Admin Console</h1>
              <p class="text-card-foreground">
                Updates made for admin and end user applications
              </p>
            </div>
          </div>

          <div
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-8 gap-5 items-start justify-center"
          >
            <Icon
              name="material-symbols:personal-injury-outline"
              class="h-20 w-40 self-start"
            ></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="text-xl font-medium">Customer Specific Logs</h1>
              <p class="text-card-foreground">
                Customer's specific history and admin actions on customer's
                profile
              </p>
            </div>
          </div>
        </div>
      </UiTabsContent>

      <UiTabsContent value="my-filtered-logs" class="space-y-4 p-4">
        <div class="flex flex-col space-y-4">
          <h1>My filtered logs</h1>
        </div>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>
