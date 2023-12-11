<script lang="ts" setup>
const openItems = ref(["item-1"]);
const data = ref<any>({});
const isLoading = ref(false);

async function getData(): Promise<any> {
  // Fetch data from your API here.
  return {
    roleId: "1",
    roleName: "Super Admin",
    roleDescription:
      "This user has all the permissions available in the system. ",
    legalEntity: ["Model Bank"],
    status: "Active",
    systemPermissions: [
      {
        ["Legal Entity"]: "Model Bank",
        ["Permissions"]: 68,
      },
    ],
    customerAccess: [{}],
  };
}

onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div
    v-if="Object.keys(data).length > 0"
    class="flex flex-col gap-5 items-center h-screen p-0 bg-secondary"
  >
    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[0.5px] rounded-md"
    >
      <div value="profile" class="space-y-4 py-4 text-base border-[0px]">
        <div class="flex flex-col space-y-4">
          <UiButton class="pr-5 w-fit self-end" variant="outline">
            <Icon
              name="material-symbols:edit-outline"
              class="w-5 h-5 mr-2 fill-black"
            />
            Edit</UiButton
          >
          <UiAccordion type="single" default-value="item-1" collapsible>
            <UiAccordionItem value="item-1">
              <UiAccordionTrigger class="md:text-lg flex-row-reverse gap-2">
                <UiBadge class="bg-green-700 md:ml-4 text-xs">Active</UiBadge>
                <p class="mr-auto">{{ data.roleName }}</p></UiAccordionTrigger
              >
              <UiAccordionContent class="w-full" v-model="openItems">
                <div class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full">
                  <div class="space-y-1">
                    <label
                      for="phoneNumber"
                      class="text-muted-foreground uppercase"
                      >Legal Entity</label
                    >
                    <p v-for="(item, index) of data.legalEntity" :key="index">
                      {{ item }}
                      {{ item.length > index + 1 ? "," : "" }}
                    </p>
                  </div>
                  <div class="space-y-1">
                    <label
                      for="phoneNumber"
                      class="text-muted-foreground uppercase"
                      >Description</label
                    >
                    <p>
                      {{ data.roleDescription }}
                    </p>
                  </div>
                </div>
              </UiAccordionContent>
            </UiAccordionItem>
          </UiAccordion>
        </div>
      </div>
    </div>

    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[1px] rounded-md"
    >
      <UiTabs default-value="permissions" class="md:space-y-4 w-full">
        <UiTabsList class="flex bg-white justify-start py-7 px-0 border-[1px]">
          <UiTabsTrigger
            value="permissions"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Permissions
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent
          value="permissions"
          class="space-y-4 text-sm md:text-base"
        >
          <div class="flex flex-col md:gap-4 w-full">
            <div class="flex flex-col space-y-4">
              <UiAccordion type="single" default-value="item-1" collapsible>
                <UiAccordionItem value="item-1">
                  <UiAccordionTrigger
                    class="md:text-lg bg-secondary px-3 gap-2 flex justify-end items-center flex-row-reverse"
                  >
                    <p class="mr-auto">System Permissions</p>
                  </UiAccordionTrigger>
                  <UiAccordionContent class="w-full" v-model="openItems">
                    <div
                      class="flex lg:grid-cols-3 gap-4 md:gap-8 w-full justify-between p-5"
                    >
                      <div class="space-y-1">
                        <label
                          for="phoneNumber"
                          class="text-muted-foreground uppercase"
                          >Legal Entity</label
                        >
                        <p>Model Bank</p>
                      </div>
                      <div class="space-y-1">
                        <label
                          for="phoneNumber"
                          class="text-muted-foreground uppercase"
                          >Permissions</label
                        >
                        <p>68</p>
                      </div>
                    </div>
                  </UiAccordionContent>
                </UiAccordionItem>
              </UiAccordion>
              <UiAccordion type="single" default-value="item-1" collapsible>
                <UiAccordionItem value="item-1">
                  <UiAccordionTrigger
                    class="md:text-lg bg-secondary px-3 gap-2 flex justify-end items-center flex-row-reverse"
                  >
                    <p class="mr-auto">Customer Access</p>
                  </UiAccordionTrigger>
                  <UiAccordionContent class="w-full" v-model="openItems">
                    <div
                      class="flex lg:grid-cols-3 gap-4 md:gap-8 w-full justify-between p-5"
                    >
                      Cusomer Access
                    </div>
                  </UiAccordionContent>
                </UiAccordionItem>
              </UiAccordion>
            </div>
          </div>
        </UiTabsContent>
      </UiTabs>
    </div>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <Loading />
  </div>
</template>

<style lang="css" scoped></style>
