<script lang="ts" setup>
const openItems = ref(["item-1"]);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div class="flex w-full items-center justify-between">
      <h1 class="md:text-xl items-center text-gray-500 font-light">
        Abebe Kebede
      </h1>
      <NuxtLink to="/customers/customerDetails/enroll"
        ><UiButton class="p-6 rounded-lg">Enroll Now</UiButton></NuxtLink
      >
    </div>

    <UiCard class="w-full p-6">
      <UiTabs default-value="profile" class="space-y-0 w-full">
        <UiTabsList
          class="w-full bg-white flex justify-start py-7 px-0 border-[1px]"
        >
          <UiTabsTrigger
            value="profile"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Profile
          </UiTabsTrigger>
          <UiTabsTrigger
            value="deposits"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
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
                <UiAccordionTrigger class="md:text-lg bg-secondary px-3"
                  >General Informations</UiAccordionTrigger
                >
                <UiAccordionContent class="w-full" v-model="openItems">
                  <div class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full p-3">
                    <div class="space-y-1">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Phone Number</label
                      >
                      <p>0911223344</p>
                    </div>
                    <div class="space-y-1">
                      <label
                        for="phoneNumber"
                        class="text-muted-foreground uppercase"
                        >Date of Birth</label
                      >
                      <p>01/04/1990</p>
                    </div>
                    <div class="space-y-1">
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
    </UiCard>

    <UiCard class="w-full p-6">
      <UiTabs default-value="contact" class="md:space-y-4 w-full">
        <UiTabsList class="flex bg-white justify-start py-7 px-0 border-[1px]">
          <UiTabsTrigger
            value="contact"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Contact
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent value="contact" class="space-y-4 text-sm md:text-base">
          <div class="flex flex-col md:gap-4 w-full">
            <div class="space-y-6 md:space-y-0 border-b-2 py-4">
              <div class="flex items-center justify-between">
                <h1 class="text-base md:text-lg">Communication</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

            <div class="space-y-6 md:space-y-0 border-b-2 py-4">
              <div class="flex items-center justify-between">
                <h1 class="text-base md:text-lg">Address</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="md:space-y-1 space-y-2">
                  <div class="flex gap-1 w-full">
                    <p class="text-muted-foreground uppercase">Home</p>
                    <UiBadge class="bg-green-700 md:ml-4 text-xs"
                      >Primary Communication Address</UiBadge
                    >
                  </div>
                  <p>Piassa,Addis Abeba,Ethiopia</p>
                </div>
              </div>
            </div>

            <div class="md:space-y-0 space-y-6 border-b-2 py-4">
              <div class="flex items-center justify-between">
                <h1 class="md:text-lg text-base">Contact Numbers</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="md:space-y-1 space-y-2">
                  <div class="flex gap-1">
                    <p class="text-muted-foreground uppercase">Mobile</p>
                    <UiBadge class="bg-green-700 md:ml-4"
                      >Primary Communication Contact</UiBadge
                    >
                  </div>

                  <p>0911332233</p>
                </div>
              </div>
            </div>

            <div class="md:space-y-0 space-y-6 border-b-2 py-4">
              <div class="flex items-center justify-between">
                <h1 class="md:text-lg text-base">Email</h1>
                <UiButton class="pr-5" variant="outline">
                  <Icon
                    name="material-symbols:edit-outline"
                    class="w-5 h-5 mr-2 fill-black"
                  />
                  Edit</UiButton
                >
              </div>
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="md:space-y-1 space-y-2">
                  <div class="flex gap-1">
                    <p class="text-muted-foreground uppercase">Other</p>
                    <UiBadge class="bg-green-700 md:ml-4"
                      >Primary Communication Email</UiBadge
                    >
                  </div>

                  <p>abebekebede@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>
</template>

<style lang="css" scoped></style>
