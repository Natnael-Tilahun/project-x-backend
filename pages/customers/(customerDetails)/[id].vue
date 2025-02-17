<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const route = useRoute();
const {
  getCustomerById,
  getCoreCustomerByAccountNumber,
  activateCustomerById,
  deActivateCustomerById,
  linkCoreBankCustomer,
  getCoreAccountsByCustomerId,
  isLoading,
} = useCustomers();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const customerId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<Customer>();
const coreData = ref<any>();
const accountsData = ref<any>();
const accountNumber = ref<string>();
const accountCustomerId = ref<string>();
const coreCustomerId = ref<string>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
customerId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const displayApiDataOnLabel = (data: any) => {
  if (data == null || data == "") {
    return "-";
  }
  if (data == false) {
    return "false";
  }
  if (data == true) {
    return "true";
  }
  return data; // Default case if customerActivated is undefined or any other value
};

const copyToClipboard = (data: any) => {
  navigator.clipboard.writeText(data);
  tooltipText.value = "Copied to clipboard";
  tooltipOpen.value = true;
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getCustomerById(customerId.value); // Call your API function to fetch roles
  console.log("customerId.value data: ", data.value);
} catch (err) {
  console.error("Error fetching customers:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const handleCustomerActivation = async () => {
  try {
    isLoading.value = true;
    loading.value = true;

    if (data.value?.customerActivated) {
      data.value = await deActivateCustomerById(customerId.value); // Call your API function to fetch roles
      toast({
        title: "Customer Deactivated",
      });
    } else {
      data.value = await activateCustomerById(customerId.value); // Call your API function to fetch roles
    }

    toast({
      title: `${
        data.value.customerActivated
          ? "Customer activated successfully. "
          : "Customer deactivated successfully. "
      }`,
    });
  } catch (err: any) {
    console.error("Error activating customers:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });

    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const handleLinkCoreBankCustomer = async () => {
  if (accountCustomerId.value) {
    try {
      isLoading.value = true;
      loading.value = true;
      data.value = await linkCoreBankCustomer(
        customerId.value,
        accountCustomerId.value
      );
      toast({
        title: "Customer linked with core bank successfully. ",
      });
    } catch (err: any) {
      console.error("Error linking customer with core bank:", err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: `${err.message}`,
        variant: "destructive",
      });

      isError.value = true;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  } else {
    return true;
  }
};

const handleUnlinkCoreBankCustomer = async () => {
  console.log("accountCustomerId.value: ", accountCustomerId.value);
  if (accountCustomerId.value) {
    try {
      isLoading.value = true;
      loading.value = true;
      data.value = await unlinkCoreBankCustomer(
        customerId.value,
        accountCustomerId.value
      );
      toast({
        title: "Customer unlinked with core bank successfully. ",
      });
    } catch (err: any) {
      console.error("Error unlinking customer with core bank:", err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: `${err.message}`,
        variant: "destructive",
      });

      isError.value = true;
    } finally {
      isLoading.value = false;
      loading.value = false;
    }
  } else {
    return true;
  }
};

const searchCoreAccountHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    coreData.value = "";
    if (accountNumber.value) {
      coreData.value = await getCoreCustomerByAccountNumber(
        accountNumber.value
      ); // Call your API function to fetch roles
      accountCustomerId.value = coreData.value?.customerId;
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error fetching customers:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "Customer not found." : err.message
      }`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const searchCoreAccountsByCustomerIdHandler = async () => {
  try {
    loading.value = true;
    console.log("coreCustomerId.value: ", coreCustomerId.value);
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value); // Call your API function to fetch roles
      console.log("response: ", response);
      accountsData.value = response;
      // accountCustomerId.value = coreData.value?.customerId;
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error fetching accounts:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "Account not found." : err.message
      }`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div class="flex w-full justify-between">
      <div
        class="flex flex-col justify-center items-center gap-3 border p-5 bg-background rounded-xl"
      >
        <img
          :src="data?.imageUrl || '/avatars/01.png'"
          class="w-16 h-16"
          alt="Profile"
        />
        <h1 class="md:text- items-center font-bold">
          {{ data?.salutation }} {{ data?.fullName }}
        </h1>
      </div>

      <div class="flex flex-col gap-2">
        <UiButton
          size="sm"
          @click="handleCustomerActivation"
          :disabled="loading || !data?.coreLinked"
          :class="data?.customerActivated ? 'bg-red-600' : 'bg-green-600'"
        >
          <Icon
            v-if="loading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          {{ data?.customerActivated ? "Deactivate" : "Activate" }}</UiButton
        >
      </div>
    </div>

    <UiCard class="w-full p-6">
      <UiTabs default-value="profile" class="space-y-0 w-full">
        <UiTabsList
          class="w-full bg-backgroung flex justify-start py- px-0 border-[1px]"
        >
          <UiTabsTrigger
            value="profile"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Profile
          </UiTabsTrigger>
          <UiTabsTrigger
            value="linkWithCoreBank"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Link with core bank
          </UiTabsTrigger>
          <UiTabsTrigger
            value="manageAccounts"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Manage Account
          </UiTabsTrigger>
          <UiTabsTrigger
            value="pinReset"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            PIN Reset
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent
          value="profile"
          class="space-y-4 pt-4 text-base border-0"
        >
          <div class="flex flex-col space-y-4">
            <UiAccordion
              type="single"
              class="space-y-6"
              default-value="item-1"
              collapsible
            >
              <UiAccordionItem value="item-1">
                <UiAccordionTrigger class="md:text-lg bg-secondary px-3"
                  >General Informations</UiAccordionTrigger
                >
                <UiAccordionContent class="w-full" v-model="openItems">
                  <div
                    class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full px-3 pt-5"
                  >
                    <div class="space-y-1">
                      <h1 class="text-muted-foreground uppercase">
                        Phone Number
                      </h1>
                      <p>{{ data?.phone || "Not Setted" }}</p>
                    </div>
                    <div class="space-y-1">
                      <h1 class="text-muted-foreground uppercase">Gender</h1>
                      <p>{{ data?.gender }}</p>
                    </div>
                    <div class="space-y-1">
                      <h1 class="text-muted-foreground uppercase">
                        Core CustomerId ID
                      </h1>
                      <p>{{ data?.coreCustomerId || "Not Setted" }}</p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Country</h1>
                      <p>{{ data?.country || "Not Setted" }}</p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        National Id
                      </h1>
                      <p>{{ data?.nationalId || "Not Setted" }}</p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Customer Activated
                      </h1>
                      <p>
                        {{
                          data?.customerActivated != null
                            ? data?.customerActivated
                            : "-"
                        }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Verified</h1>
                      <p>{{ data?.verified != null ? data?.verified : "-" }}</p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        IsEnrolled
                      </h1>
                      <p>
                        {{ data?.isEnrolled != null ? data.isEnrolled : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Status</h1>
                      <p>{{ data?.status != null ? data?.status : "-" }}</p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Core Linked
                      </h1>
                      <p>
                        {{ data?.coreLinked != null ? data.coreLinked : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Vip customer
                      </h1>
                      <p>
                        {{ data?.vipcustomer != null ? data.vipcustomer : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Olb Allowed
                      </h1>
                      <p>
                        {{ data?.olbAllowed != null ? data.olbAllowed : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Roles</h1>
                      <ul class="px-3 pt-1">
                        <li
                          class="list-disc"
                          v-for="(item, index) in data?.roles"
                          :key="index"
                        >
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Staff Member
                      </h1>
                      <p>
                        {{ data?.staffMember != null ? data.staffMember : "-" }}
                      </p>
                    </div>
                  </div>
                </UiAccordionContent>
              </UiAccordionItem>
              <UiAccordionItem value="item-2">
                <UiAccordionTrigger class="md:text-lg bg-secondary px-3"
                  >Contact</UiAccordionTrigger
                >
                <UiAccordionContent class="w-full" v-model="openItems">
                  <div
                    class="flex flex-col md:gap-4 w-full space-y-4 text-sm md:text-base p-6"
                  >
                    <div class="space-y-6 md:space-y-0 border-b-2">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base">Communication</h1>
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="space-y-0">
                          <h1 class="text-muted-foreground uppercase text-sm">
                            Preferred Contact Method
                          </h1>
                          <p>N/A</p>
                        </div>
                        <div class="space-y-0">
                          <h1
                            for="phoneNumber"
                            class="text-muted-foreground uppercase text-sm"
                          >
                            Preferred Contact Time
                          </h1>
                          <p>N/A</p>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">
                          Address1
                        </h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>{{ data?.addressLine1 || "Not Setted" }}</p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">
                          Address2
                        </h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.addressLine2 || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">State</h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.state || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">City</h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.city || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="md:space-y-0 space-y-6 border-b-2 pb-4">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">
                          Contact Numbers
                        </h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>{{ data?.phone || "-" }}</p>
                      </div>
                    </div>

                    <div class="md:space-y-0 space-y-6">
                      <div class="flex items-center justify-between">
                        <h1 class="text-base text-muted-foreground">Email</h1>
                        <UiButton class="pr-5" variant="outline">
                          <Icon
                            name="material-symbols:edit-outline"
                            class="w-5 h-5 mr-2 fill-black"
                          />
                          Edit</UiButton
                        >
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>{{ data?.email || "-" }}</p>
                      </div>
                    </div>
                  </div>
                </UiAccordionContent>
              </UiAccordionItem>
            </UiAccordion>
          </div>
        </UiTabsContent>

        <UiTabsContent value="linkWithCoreBank" class="space-y-4 py-8">
          <div class="flex flex-col space-y-8">
            <div class="flex gap-8 items-center">
              <div class="grid w-full max-w-sm items-center gap-2">
                <UiLabel for="search" class="font-normal text-muted-foreground"
                  >Find customer by account number</UiLabel
                >
                <div class="flex items-center gap-2">
                  <UiInput
                    id="search"
                    type="search"
                    placeholder="Search..."
                    class="md:w-[100px] lg:w-[300px]"
                    v-model="accountNumber"
                  />
                  <UiButton
                    :disabled="accountNumber == ''"
                    @click="searchCoreAccountHandler"
                  >
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="isLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Search</UiButton
                  >
                </div>
              </div>
              <div class="grid w-full max-w-sm items-center gap-2">
                <UiLabel for="search" class="font-normal text-muted-foreground"
                  >Link with core bank</UiLabel
                >
                <div class="flex items-center gap-2">
                  <UiInput
                    id="linkWithCore"
                    type="test"
                    placeholder="Enter Customer Id "
                    class="md:w-[100px] lg:w-[300px]"
                    v-model="accountCustomerId"
                  />
                  <UiButton @click="handleLinkCoreBankCustomer">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="loading"
                      :disabled="loading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Link
                  </UiButton>
                </div>
              </div>

              <div class="grid w-full max-w-sm items-center gap-2">
                <UiLabel for="search" class="font-normal text-muted-foreground"
                  >Unlink with core bank</UiLabel
                >
                <div class="flex items-center gap-2">
                  <UiInput
                    id="linkWithCore"
                    type="test"
                    placeholder="Enter Customer Id "
                    class="md:w-[100px] lg:w-[300px]"
                    v-model="accountCustomerId"
                  />
                  <UiButton @click="setOpenEditModal(true)">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="loading"
                      :disabled="loading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Unlink
                  </UiButton>
                </div>
              </div>
            </div>

            <UiCard
              class="grid lg:grid-cols-4 gap-4 md:gap-8 w-full p-6"
              v-if="isLoading"
            >
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
              <UiSkeleton class="h-16 w-full" />
            </UiCard>

            <UiCard v-else-if="coreData" class="w-full text-sm">
              <div class="grid lg:grid-cols-4 gap-4 md:gap-8 w-full p-6">
                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">Full Name</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.fullName || "Not Setted" }}
                  </p>
                </div>
                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">Phone Number</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.phone || "Not Setted" }}
                  </p>
                </div>
                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">Email</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.email || "Not Setted" }}
                  </p>
                </div>
                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">Gender</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.gender }}
                  </p>
                </div>

                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">
                    Core CustomerId ID
                  </h1>

                  <UiTooltipProvider>
                    <UiTooltip :delayDuration="2000" :update:open="tooltipOpen">
                      <UiTooltipTrigger
                        @click="copyToClipboard(coreData?.customerId)"
                        as-child
                      >
                        <div
                          class="flex border px-2 py-1 rounded-md justify-between items-center hover:cursor-pointer"
                        >
                          <p>{{ coreData?.customerId || "Not Setted" }}</p>
                          <Icon
                            name="material-symbols:content-copy"
                            class="h-5 w-5 text-primary"
                          ></Icon>
                        </div>
                      </UiTooltipTrigger>
                      <UiTooltipContent>
                        <p>Copy to clipboard</p>
                      </UiTooltipContent>
                    </UiTooltip>
                  </UiTooltipProvider>
                </div>

                <div class="space-y-1">
                  <h1 class="text-muted-foreground uppercase">Date Of Birth</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{
                      new Date(coreData?.dateOfBirth).toLocaleDateString() ||
                      "Not Setted"
                    }}
                  </p>
                </div>

                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Country</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.townCountry || "Not Setted" }}
                  </p>
                </div>

                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Address</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.address) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Street</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.street) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Residence</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.residence) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">House No</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.houseNo) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Nationality</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.nationality) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">
                    Marital Status
                  </h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ coreData?.maritalStatus || "Not Setted" }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Customer Type</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.customerType) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Status</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.customerStatus) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Mnemonic</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.mnemonic) }}
                  </p>
                </div>

                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Title</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.title) }}
                  </p>
                </div>
                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">
                    Customer Branch Code
                  </h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{
                      coreData?.customerBranchCode != null
                        ? coreData.customerBranchCode
                        : "-"
                    }}
                  </p>
                </div>

                <div class="space-y-0">
                  <h1 class="text-muted-foreground uppercase">Language</h1>
                  <p class="border px-2 py-1 rounded-md">
                    {{ displayApiDataOnLabel(coreData?.language) }}
                  </p>
                </div>
              </div>
            </UiCard>
            <UiCard
              v-else
              class="w-full h-40 flex flex-col justify-center items-center text-sm"
            >
              <h1 class="text-muted-foreground">
                No core customer detail found
              </h1>
              <p class="text-muted-foreground">
                Search by account number to get core customer details
              </p>
            </UiCard>
          </div>
        </UiTabsContent>

        <UiTabsContent value="manageAccounts" class="space-y-4 py-8">
          <CustomersManageAccounts />
        </UiTabsContent>

        <UiTabsContent value="pinReset" class="space-y-4 py-8">
          <CustomersPinReset />
        </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently unlink the
          customer from core bank.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="handleUnlinkCoreBankCustomer">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="loading"
            :disabled="loading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
