<script lang="ts" setup></script>

<template>
  <div class="flex flex-col w-full items-center h-screen md:p-10 border-0">
    <UiTabs default-value="default-system-logs" class="space-y-0 w-full">
      <UiTabsList
        class="w-full bg-white flex justify-start py-7 px-0 border-[1px]"
      >
        <UiTabsTrigger
          value="default-system-logs"
          class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
        >
          Default System Logs
        </UiTabsTrigger>
        <UiTabsTrigger
          value="my-filtered-logs"
          class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
        >
          My Filtered Logs
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="default-system-logs"
        class="space-y-4 py-10 text-base border-[0px]"
      >
        <div class="flex flex-col md:flex-row flex-wrap gap-10">
          <NuxtLink
            to="/log/transactions"
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-5 w-full md:p-8 gap-5 items-start justify-center"
          >
            <Icon
              name="icon-park-outline:transaction"
              class="md:h-20 md:w-40 h-16 w-16 self-start"
            ></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="md:text-xl text-lg font-medium">Transactions</h1>
              <p class="text-card-foreground text-sm md:text-base">
                Details of all transactions initiated on the digiatl banking
                channle
              </p>
            </div>
          </NuxtLink>

          <div
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-5 md:p-8 gap-5 items-start justify-center"
          >
            <Icon
              name="mdi:console"
              class="md:h-20 md:w-40 h-16 w-16 self-start"
            ></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="md:text-xl text-lg font-medium">Admin Console</h1>
              <p class="text-card-foreground text-sm md:text-base">
                Updates made for admin and end user applications
              </p>
            </div>
          </div>

          <div
            class="flex shadow-lg rounded-lg bg-card border-[1px] p-5 md:p-8 gap-5 items-start justify-center"
          >
            <Icon
              name="material-symbols:personal-injury-outline"
              class="md:h-20 md:w-40 h-16 w-16 self-start"
            ></Icon>
            <div class="flex flex-col gap-2">
              <h1 class="md:text-xl text-lg font-medium">
                Customer Specific Logs
              </h1>
              <p class="text-sm md:text-base text-card-foreground">
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
