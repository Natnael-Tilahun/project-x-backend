<script lang="ts" setup>
import Loading from "~/components/Loading.vue";

const openItems = ref(["item-1"]);
const data = ref<any>([]);
const isLoading = ref(false);

async function getData(): Promise<any> {
  // Fetch data from your API here.
  return [
    {
      personalInformation: {
        fullName: "Natnael Tilahun",
        email: "abebekebede@gmail.com",
        userName: "abe",
      },
      businessInformation: {
        userType: "External",
        lineOfBusiness: ["Retail Business", "Small Business"],
        reportingManager: "Kebede Abebe",
        branchName: "Finfine Branch",
        branchAddress: "Legehar, Addis Abeba, Ethiopia",
      },
      roles: [
        {
          name: "Business",
          description:
            "This role is for business users who wants to view the admin console capabilities, review data but not make major changes. This users can also send messages to customers and view/update thier details.",
          legalEntity: ["Model Bank"],
        },
        {
          name: "Manager",
          description:
            "This role is similar to frontline staff admin but with more privilages to control what kind of information can be updated by a frontline staff.",
          legalEntity: ["Model Bank"],
        },
      ],
      permissions: [],
    },
  ];
}
onMounted(async () => {
  data.value = await getData();
});
</script>

<template>
  <div
    v-if="data.length > 0"
    class="flex flex-col gap-5 items-center h-screen p-0 bg-secondary"
  >
    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[0.5px] rounded-md"
    >
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
            <UiAccordionTrigger class="md:text-lg bg-secondary px-3"
              >Personal Informations</UiAccordionTrigger
            >
            <UiAccordionContent class="w-full" v-model="openItems">
              <div class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full p-3">
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Full Name</label
                  >
                  <p>{{ data[0].personalInformation.fullName }}</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Email Address</label
                  >
                  <p>{{ data[0].personalInformation.email }}</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Username</label
                  >
                  <p>{{ data[0].personalInformation.userName }}</p>
                </div>
              </div>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem value="item-1">
            <UiAccordionTrigger class="md:text-lg bg-secondary px-3"
              >Business Informations</UiAccordionTrigger
            >
            <UiAccordionContent class="w-full" v-model="openItems">
              <div class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full p-3">
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >User Type</label
                  >
                  <p>{{ data[0].businessInformation.userType }}</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Line of Business</label
                  >
                  <p
                    v-for="(item, index) in data[0].businessInformation
                      .lineOfBusiness"
                    :key="item"
                  >
                    {{ item }}
                    {{
                      data[0].businessInformation.lineOfBusiness.length >
                      index + 1
                        ? ","
                        : ""
                    }}
                  </p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Reporting Manager</label
                  >
                  <p>{{ data[0].businessInformation.reportingManager }}</p>
                </div>

                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Branch Name</label
                  >
                  <p>{{ data[0].businessInformation.branchName }}</p>
                </div>
                <div class="space-y-1">
                  <label
                    for="phoneNumber"
                    class="text-muted-foreground uppercase"
                    >Branch Address</label
                  >
                  <p>{{ data[0].businessInformation.branchAddress }}</p>
                </div>
              </div>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </div>
    </div>

    <div
      class="w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[1px] rounded-md"
    >
      <UiTabs default-value="roles" class="md:space-y-4 w-full">
        <UiTabsList class="flex bg-white justify-start py-7 px-0 border-[1px]">
          <UiTabsTrigger
            value="roles"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Roles
          </UiTabsTrigger>
          <UiTabsTrigger
            value="permissions"
            class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
          >
            Permissions
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent value="roles" class="space-y-4 text-sm md:text-base">
          <UiTable>
            <UiTableHeader>
              <UiTableRow>
                <UiTableHead class=""> Name </UiTableHead>
                <UiTableHead>Description</UiTableHead>
                <UiTableHead>Legal Entity</UiTableHead>
              </UiTableRow>
            </UiTableHeader>
            <UiTableBody>
              <UiTableRow v-for="(role, index) of data[0].roles" :key="index">
                <UiTableCell class="font-medium">
                  {{ role.name }}
                </UiTableCell>
                <UiTableCell class="max-w-[350px]">{{
                  role.description
                }}</UiTableCell>
                <UiTableCell>
                  <p
                    class="w-full inline"
                    v-for="(item, index) in role.legalEntity"
                    :key="index"
                  >
                    {{ item }}
                    {{ role.legalEntity.length > index + 1 ? "," : "" }}
                  </p>
                </UiTableCell>
              </UiTableRow>
            </UiTableBody>
          </UiTable>
        </UiTabsContent>
        <UiTabsContent
          value="permissions"
          class="space-y-4 text-sm md:text-base"
        >
          <div>Permissions</div>
        </UiTabsContent>
      </UiTabs>
    </div>
  </div>
  <div v-else class="py-10 flex justify-center items-center">
    <Loading />
  </div>
</template>

<style lang="css" scoped></style>
