<script lang="ts" setup></script>

<template>
  <div class="w-full h-screen">
    <UiTabs default-value="default-system-logs" class="h-full w-full">
      <UiTabsList
        class="w-full bg-background flex justify-start py-7 px-0 border-[1px]"
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
        class="space-y-4 px-6 py-12 text-base border-[0.5px] h-full"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <NuxtLink to="/log/transactions">
            <UiCard
              class="hover:shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 h-full"
            >
              <UiCardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <UiCardTitle class="text-xl"> Transactions </UiCardTitle>
                <Icon
                  name="icon-park-outline:transaction"
                  size="40"
                  class="text-muted-foreground"
                ></Icon>
              </UiCardHeader>
              <UiCardContent>
                <p class="text-sm text-muted-foreground">
                  Details of all transactions initiated on the digiatl banking
                  channle
                </p>
              </UiCardContent>
            </UiCard>
          </NuxtLink>

          <NuxtLink to="/log/adminConsole">
            <UiCard
              class="hover:shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 h-full"
            >
              <UiCardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <UiCardTitle class="text-xl"> Admin Console </UiCardTitle>
                <Icon
                  name="mdi:console"
                  size="40"
                  class="text-muted-foreground"
                ></Icon>
              </UiCardHeader>
              <UiCardContent>
                <p class="text-sm text-muted-foreground">
                  Updates made for admin and end user applications
                </p>
              </UiCardContent>
            </UiCard>
          </NuxtLink>

          <NuxtLink to="/log/customerSpecific">
            <UiCard
              class="hover:shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 h-full"
            >
              <UiCardHeader
                class="flex flex-row items-center justify-between space-y-0 pb-2"
              >
                <UiCardTitle class="text-xl">
                  Customer Specific Logs
                </UiCardTitle>
                <Icon
                  name="material-symbols:personal-injury-outline"
                  size="40"
                  class="text-muted-foreground"
                ></Icon>
              </UiCardHeader>
              <UiCardContent>
                <p class="text-sm text-muted-foreground">
                  Customer's specific history and admin actions on customer's
                  profile
                </p>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
      </UiTabsContent>

      <UiTabsContent
        value="my-filtered-logs"
        class="space-y-4 px-6 py-12 text-base border-[0.5px] h-full"
      >
        <div class="flex flex-col space-y-4">
          <h1>My filtered logs</h1>
        </div>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>
