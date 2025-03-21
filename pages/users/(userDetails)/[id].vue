<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";
import type { User } from "~/types";

const route = useRoute();
const {
  getUserById,
  getCoreAccountsByCustomerId,
  isLoading,
} = useUsers();
const customerId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<User>();
const coreData = ref<any>();
const accountsData = ref<any>();
const accountNumber = ref<string>();
const accountCustomerId = ref<string>();
const coreCustomerId = ref<string>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
const openEditModal = ref(false);
const openLinkModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};
const setOpenLinkModal = (value: boolean) => {
  openLinkModal.value = value;
};

customerId.value = getIdFromPath(route.fullPath);

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
  toast({
    title: "Copied to clipboard",
  });
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getUserById(customerId.value); // Call your API function to fetch roles
  console.log("customerId.value data: ", data.value);
} catch (err) {
  console.error("Error fetching users:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}


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
      setOpenLinkModal(false);
    }
  } else {
    return true;
  }
};

const handleUnlinkCoreBankCustomer = async () => {
  if (customerId.value) {
    try {
      isLoading.value = true;
      loading.value = true;
      data.value = await unLinkCoreBankCustomer(customerId.value);
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
      openEditModal.value = false;
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

</script>

<template>
  <div class="flex flex-col gap-6 items-center">
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
            value="devices"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Devices
          </UiTabsTrigger>
          <UiTabsTrigger
            value="pinReset"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            PIN Reset
          </UiTabsTrigger>
          <UiTabsTrigger
            value="linkWithCoreBank"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Contracts
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent value="profile" class="space-y-4 pt-4 text-sm border-0">
          <UiCard class="grid lg:grid-cols-3 gap-4 md:gap-8 w-full p-6">
            <div class="space-y-1">
              <h1 class="text-muted-foreground uppercase">ID</h1>
              <div
                @click="copyToClipboard(data?.id)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.id || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Username</h1>
              <div
                @click="copyToClipboard(data?.login)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.login || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Phone Number</h1>
              <div
                @click="copyToClipboard(data?.phone)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.phone || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-1">
              <h1 class="text-muted-foreground">Email</h1>
              <div
                @click="copyToClipboard(data?.email)"
                class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
              >
                <p>{{ data?.email || "Not Setted" }}</p>
                <Icon
                  name="material-symbols:content-copy"
                  class="h-5 w-5 text-primary"
                ></Icon>
              </div>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">National Id</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.nationalId || "Not Setted" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">User Activated</h1>
              <UiBadge
                class="p-2 rounded-md w-full"
                :class="data?.activated  ? 'bg-green-500' : 'bg-red-500'"
              >
                {{ data?.activated  ? "Active" : "Inactive" }}
              </UiBadge>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Verified</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.verified != null ? data?.verified : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is Enrolled</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.isEnrolled != null ? data.isEnrolled : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Email Verified</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.emailVerified != null ? data?.emailVerified : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Force PIN Change</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.forcePinChange != null ? data.forcePinChange : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is Pin Set</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.isPinSet != null ? data.isPinSet : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Is User Account Locked</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.isUserAccountLocked != null
                    ? data.isUserAccountLocked
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Created By</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.createdBy != null ? data.createdBy : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Created Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.createdDate != null
                    ? new Date(data.createdDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Current Login Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.currentLoginTime != null
                    ? new Date(data.currentLoginTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Device Id</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.deviceId != null ? data.deviceId : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Image Url</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.imageUrl != null ? data.imageUrl : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Language Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.langKey != null ? data.langKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Login Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lastLoginTime != null
                    ? new Date(data.lastLoginTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Modified By</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.lastModifiedBy != null ? data.lastModifiedBy : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Last Modified Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lastModifiedDate != null
                    ? new Date(data.lastModifiedDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Lock Count</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.lockCount != null ? data.lockCount : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Lockout Date Time</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.lockoutDateTime != null
                    ? new Date(data.lockoutDateTime).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Preferred Otp Method</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.preferredOtpMethod != null
                    ? data.preferredOtpMethod
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Reset Date</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.resetDate != null
                    ? new Date(data.resetDate).toLocaleDateString()
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Reset Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.resetKey != null ? data.resetKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Unsuccessful Login Attempts</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{
                  data?.unsuccessfulLoginAttempts != null
                    ? data.unsuccessfulLoginAttempts
                    : "-"
                }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Verification Key</h1>
              <p class="border p-2 bg-muted rounded-md">
                {{ data?.verificationKey != null ? data.verificationKey : "-" }}
              </p>
            </div>
            <div class="space-y-0">
              <h1 class="text-muted-foreground">Roles</h1>
              <ul class="border py-3 px-6 bg-muted rounded-md">
                <li
                  class="list-disc"
                  v-for="(item, index) in data?.authorities"
                  :key="index"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </UiCard>
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
                  <UiButton @click="setOpenLinkModal(true)">
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
                  >Unlink</UiLabel
                >
                <div class="flex items-center gap-2">
                  <UiInput
                    id="linkWithCore"
                    type="test"
                    placeholder="Enter Customer Id "
                    class="md:w-[100px] lg:w-[300px]"
                    v-model="customerId"
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

        <UiTabsContent value="devices" class="space-y-4 py-8">
          <UsersDevices />
        </UiTabsContent>

        <UiTabsContent value="pinReset" class="space-y-4 py-8">
          <UsersPinReset />
        </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>

  <UiAlertDialog :open="openLinkModal" :onOpenChange="setOpenLinkModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This will permanently link the customer with core bank.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenLinkModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="handleLinkCoreBankCustomer">
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
