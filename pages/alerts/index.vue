<script lang="ts" setup></script>

<template>
  <div class="flex flex-col w-full h-screen items-center gap-10">
    <div class="w-full flex justify-between">
      <div class="pb-4">
        <h1 class="md:text-2xl text-lg font-medium">Alert Categories</h1>
        <p class="text-sm text-muted-foreground">
          View, create, update alert categories
        </p>
      </div>
      <NuxtLink to="/alerts/addCategory" class="self-end">
        <UiButton variant="default" class="p-6 rounded-lg"
          >Add Alert Category</UiButton
        >
      </NuxtLink>
    </div>

    <UiCard class="p-6 md:space-y-10 h-full w-full">
      <div class="flex justify-end">
        <UiButton class="pr-5" variant="outline"> Reorder</UiButton>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <NuxtLink to="/log/transactions">
          <UiCard
            class="hover:shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 h-full"
          >
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-xl font-medium">
                Transaction and Payment
              </UiCardTitle>

              <UiBadge class="bg-green-600">Active</UiBadge>
            </UiCardHeader>
            <UiCardContent>
              <div
                class="flex gap-4 text-sm font-medium text-muted-foreground uppercase"
              >
                <p>Groups - <span> 6</span></p>
                <p>Alerts - <span> 10</span></p>
              </div>
            </UiCardContent>
          </UiCard>
        </NuxtLink>

        <NuxtLink to="/log/transactions">
          <UiCard
            class="hover:shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 h-full"
          >
            <UiCardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <UiCardTitle class="text-xl font-medium"> Account </UiCardTitle>

              <UiBadge class="bg-green-600">Active</UiBadge>
            </UiCardHeader>
            <UiCardContent>
              <div
                class="flex gap-4 text-sm font-medium text-muted-foreground uppercase"
              >
                <p>Groups - <span> 1</span></p>
                <p>Alerts - <span> 1</span></p>
              </div>
            </UiCardContent>
          </UiCard>
        </NuxtLink>
      </div>
    </UiCard>
  </div>
</template>
