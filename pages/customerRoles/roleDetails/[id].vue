<script lang="ts" setup>
const openItems = ref(["item-1"]);
</script>

<template>
  <div class="flex flex-col gap-6 items-center h-full">
    <UiCard class="w-full p-6">
      <div class="flex flex-col space-y-4">
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem value="item-1">
            <UiAccordionTrigger class="md:text-lg flex-row-reverse gap-2">
              <UiBadge class="bg-green-700 md:ml-4 text-xs">Active</UiBadge>
              <p class="mr-auto md:text-xl">Roll Details</p></UiAccordionTrigger
            >
            <UiAccordionContent class="w-full border-none" v-model="openItems">
              <div class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full">
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Roll Name</label
                  >
                  <p>Administrator</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Roll Type</label
                  >
                  <p>Business Banking</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >E-Agreement</label
                  >
                  <p>Non Required</p>
                </div>
                <div class="space-y-0">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Buisness Type</label
                  >
                  <p>
                    Sole Proprietor, Partnership, Unincorporated, Association,
                    Trust, Corporation
                  </p>
                </div>
                <div class="space-y-0">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Default for Buisness Type</label
                  >
                  <p>Sole Proprietor</p>
                </div>
                <div class="space-y-0 col-span-full">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Description</label
                  >
                  <p>
                    This business users have the highest level of access to all
                    the functions, can create, authorize transactions & manage
                    access of other users(register / suspend / activate users,
                    limit access to accounts & functions, set transaction
                    limits)
                  </p>
                </div>
              </div>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </div>
    </UiCard>

    <UiCard class="w-full p-6">
      <UiTabs default-value="contact" class="md:space-y-4 w-full">
        <UiTabsList
          class="flex bg-background justify-start py-7 px-0 border-[1px]"
        >
          <UiTabsTrigger
            value="contact"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Features
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent value="contact" class="space-y-4 text-sm md:text-base">
          <div class="flex flex-col md:gap-4 w-full">
            <div class="flex flex-col space-y-4">
              <UiAccordion type="single" default-value="item-1" collapsible>
                <UiAccordionItem value="item-1">
                  <UiAccordionTrigger
                    class="md:text-lg bg-secondary px-3 gap-2 flex justify-end items-center flex-row-reverse"
                  >
                    <UiBadge class="bg-green-700 md:ml-4 text-xs"
                      >Active</UiBadge
                    >
                    <p class="mr-auto">Check Management</p>
                  </UiAccordionTrigger>
                  <UiAccordionContent class="w-full" v-model="openItems">
                    <div
                      class="flex lg:grid-cols-3 gap-4 md:gap-8 w-full justify-between p-5"
                    >
                      <div class="space-y-1">
                        <label
                          for="phoneNumber"
                          class="text-muted-foreground uppercase"
                          >Action</label
                        >
                        <p>Check management add stop check</p>
                      </div>
                      <div class="space-y-1">
                        <label
                          for="phoneNumber"
                          class="text-muted-foreground uppercase"
                          >Description</label
                        >
                        <p>Check management add stop check request</p>
                      </div>
                      <div class="space-y-1">
                        <label
                          for="phoneNumber"
                          class="text-muted-foreground uppercase"
                          >Limits</label
                        >
                        <p>View</p>
                      </div>
                    </div>
                  </UiAccordionContent>
                </UiAccordionItem>
              </UiAccordion>
            </div>
          </div>
        </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>
</template>

<style lang="css" scoped></style>
