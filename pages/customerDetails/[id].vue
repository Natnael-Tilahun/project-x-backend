<script lang="ts" setup>
const openItems = ref(["item-1"]);
</script>

<template>
  <div class="flex flex-col gap-5 items-center h-screen p-0 bg-secondary">
    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[0.5px] rounded-md"
    >
      <div class="flex justify-between">
        <h1 class="text-xl items-center text-gray-500">Abebe Kebede</h1>
        <UiButton class="p-6 rounded-lg">Enroll Now</UiButton>
      </div>

      <UiTabs default-value="profile" class="space-y-0 w-full">
        <UiTabsList
          class="w-full bg-white flex justify-start py-7 px-0 border-[1px]"
        >
          <UiTabsTrigger
            value="profile"
            class="text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Profile
          </UiTabsTrigger>
          <UiTabsTrigger
            value="deposits"
            class="text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
            disabled
          >
            Deposits
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent
          value="profile"
          class="space-y-4 py-4 text-base border-[0px]"
        >
          <div class="flex flex-col space-y-4">
            <UiAccordion type="single" default-value="item-1" collapsible>
              <UiAccordionItem value="item-1">
                <UiAccordionTrigger class="text-lg"
                  >General Informations</UiAccordionTrigger
                >
                <UiAccordionContent class="w-full" v-model="openItems">
                  <div class="grid grid-cols-3 gap-10 w-full">
                    <div class="space-y-0">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Phone Number</label
                      >
                      <p>0911223344</p>
                    </div>
                    <div class="space-y-0">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Date of Birth</label
                      >
                      <p>01/04/1990</p>
                    </div>
                    <div class="space-y-0">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Customer ID</label
                      >
                      <p>342323</p>
                    </div>
                    <div class="space-y-0">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Mobile / Online Banking Access</label
                      >
                      <p>342323</p>
                    </div>
                  </div>
                </UiAccordionContent>
              </UiAccordionItem>
            </UiAccordion>
          </div>
        </UiTabsContent>

        <UiTabsContent value="deposits" class="space-y-4 p-4">
          <div class="flex flex-col space-y-4">
            <h1>Deposits</h1>
          </div>
        </UiTabsContent>
      </UiTabs>
    </div>

    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[1px] rounded-md"
    >
      <UiTabs default-value="contact" class="space-y-4 w-full">
        <UiTabsList class="flex bg-white justify-start py-7 px-0 border-[1px]">
          <UiTabsTrigger
            value="contact"
            class="text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Contact
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent value="contact" class="space-y-4 text-base">
          <div class="flex flex-col gap-4 w-full">
            <div class="space-y-0 border-b-2 py-4">
              <div class="flex justify-between">
                <h1 class="text-lg">Communication</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-2">
                <div class="space-y-0">
                  <label class="text-muted-foreground uppercase"
                    >Preferred Contact Method</label
                  >
                  <p>N/A</p>
                </div>
                <div class="space-y-0">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Preferred Contact Time</label
                  >
                  <p>N/A</p>
                </div>
              </div>
            </div>

            <div class="space-y-0 border-b-2 py-4">
              <div class="flex justify-between">
                <h1 class="text-lg">Address</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-2">
                <div class="space-y-1">
                  <p class="text-muted-foreground uppercase">
                    Home
                    <UiBadge class="bg-green-700 ml-4"
                      >Primary Communication Address</UiBadge
                    >
                  </p>
                  <p>Piassa,Addis Abeba,Ethiopia</p>
                </div>
              </div>
            </div>

            <div class="space-y-0 border-b-2 py-4">
              <div class="flex justify-between">
                <h1 class="text-lg">Contact Numbers</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-2">
                <div class="space-y-1">
                  <p class="text-muted-foreground uppercase">
                    Mobile
                    <UiBadge class="bg-green-700 ml-4"
                      >Primary Communication Contact</UiBadge
                    >
                  </p>
                  <p>0911332233</p>
                </div>
              </div>
            </div>

            <div class="space-y-0 border-b-2 py-4">
              <div class="flex justify-between">
                <h1 class="text-lg">Email</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-2">
                <div class="space-y-1">
                  <p class="text-muted-foreground uppercase">
                    Other
                    <UiBadge class="bg-green-700 ml-4"
                      >Primary Communication Email</UiBadge
                    >
                  </p>
                  <p>abebekebede@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </UiTabsContent>
      </UiTabs>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
