<script lang="ts" setup>
const openItems = ref("profile");

import { ref } from "vue";
import PassphraseReset from "~/components/customers/PassphraseReset.vue";
import UnlockCustomer from "~/components/customers/UnlockCustomer.vue";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
import type { Customer } from "~/types";

const route = useRoute();
const {
  getCustomerById,
  getCoreCustomerByAccountNumber,
  activateCustomerById,
  deActivateCustomerById,
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
  const activeTab = route.query.activeTab as string;
  openItems.value = activeTab || "profile";

customerId.value = getIdFromPath();


function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

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
  data.value = await getCustomerById(customerId.value); // Call your API function to fetch roles
  accountCustomerId.value = data.value?.coreCustomerId;
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

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);

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

        <UiPermissionGuard :permission="data?.customerActivated ? PermissionConstants.DEACTIVATE_CUSTOMER : PermissionConstants.ACTIVATE_CUSTOMER">
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
      </UiPermissionGuard>
    </div>

    <UiCard class="w-full p-6">
      <UiTabs v-model="openItems" class="space-y-0 w-full">
        <UiTabsList
          class="w-full overflow-x-auto bg-backgroung flex justify-start py- px-0 border-[1px]"
        >
        <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER >
          <UiTabsTrigger
            value="profile"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'profile',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Profile
          </UiTabsTrigger>
        </UiPermissionGuard>
        <!-- <UiPermissionGuard permission="LINK_CUSTOMER_CORE_BANKING" >
          <UiTabsTrigger
            value="linkWithCoreBank"
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Link with core bank
          </UiTabsTrigger>
        </UiPermissionGuard> -->
        <UiPermissionGuard :permission=PermissionConstants.RESET_CUSTOMER_PIN >
          <UiTabsTrigger
            value="pinReset"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'pinReset',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            PIN Reset
          </UiTabsTrigger>
          <UiPermissionGuard :permission=PermissionConstants.RESET_CUSTOMER_PASSPHRASE >
          <UiTabsTrigger
            value="passphraseReset"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'passphraseReset',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Passphrase Reset
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.UNLOCK_CUSTOMER >
          <UiTabsTrigger
            value="unlockCustomer"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'unlockCustomer',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Unlock Customer
          </UiTabsTrigger>
        </UiPermissionGuard>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_DEVICE >
        <UiTabsTrigger
            value="devices"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'devices',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Devices
          </UiTabsTrigger>
          </UiPermissionGuard>
          <!-- <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_LOGIN_HISTORY > -->
        <UiTabsTrigger
            value="loginHistory"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'loginHistory',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
          Login History
          </UiTabsTrigger>
          <!-- </UiPermissionGuard> -->
               <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_CONTRACT >
                <UiTabsTrigger
            value="contracts"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'contracts',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
            Contracts
          </UiTabsTrigger>
          </UiPermissionGuard>
          <UiTabsTrigger
            value="CustomerGroups"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'CustomerGroups',
                },
              })
            "
            class="md:text-xl border data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
          >
          Customer Groups
          </UiTabsTrigger>
          
        </UiTabsList>
        

        <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER >
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
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.phone || "Not Setted" }}
                      </p>
                    </div>
                    <div class="space-y-1">
                      <h1 class="text-muted-foreground uppercase">Gender</h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.gender }}
                      </p>
                    </div>
                    <div class="space-y-1">
                      <h1 class="text-muted-foreground uppercase">
                        Core CustomerId ID
                      </h1>
                      <div
                        @click="copyToClipboard(data?.coreCustomerId)"
                        class="flex items-center gap-4 cursor-pointer justify-between border p-2 bg-muted rounded-md"
                      >
                        <p>{{ data?.coreCustomerId || "Not Setted" }}</p>
                        <Icon
                          name="material-symbols:content-copy"
                          class="h-5 w-5 text-primary"
                        ></Icon>
                      </div>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Country</h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.country || "Not Setted" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        National Id
                      </h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.nationalId || "Not Setted" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Customer Activated
                      </h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{
                          data?.customerActivated != null
                            ? data?.customerActivated
                            : "-"
                        }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Verified</h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.verified != null ? data?.verified : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Status</h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.status != null ? data?.status : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">
                        Olb Allowed
                      </h1>
                      <p class="border p-2 bg-muted rounded-md">
                        {{ data?.olbAllowed != null ? data.olbAllowed : "-" }}
                      </p>
                    </div>
                    <div class="space-y-0">
                      <h1 class="text-muted-foreground uppercase">Roles</h1>
                      <ul class="border py-3 px-6 bg-muted rounded-md">
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
                      <p class="border p-2 bg-muted rounded-md">
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
                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
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
                        <h1 class="text-base text-muted-foreground">
                          Address1
                        </h1>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>{{ data?.addressLine1 || "Not Setted" }}</p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                        <h1 class="text-base text-muted-foreground">
                          Address2
                        </h1>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.addressLine2 || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                        <h1 class="text-base text-muted-foreground">State</h1>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.state || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-6 md:space-y-0 border-b-2 pb-4">
                        <h1 class="text-base text-muted-foreground">City</h1>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>
                          {{ data?.city || "Not Setted" }}
                        </p>
                      </div>
                    </div>

                    <div class="md:space-y-0 space-y-6 border-b-2 pb-4">
                        <h1 class="text-base text-muted-foreground">
                          Contact Numbers
                        </h1>
                      <div class="grid grid-cols-1 lg:grid-cols-2">
                        <p>{{ data?.phone || "-" }}</p>
                      </div>
                    </div>

                    <div class="md:space-y-0 space-y-6">
                        <h1 class="text-base text-muted-foreground">Email</h1>
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
      </UiPermissionGuard>

        <UiTabsContent value="pinReset" class="space-y-4 py-8">
          <CustomersPinReset :phone="data?.phone" :customerId="customerId" :coreCustomerId="data?.coreCustomerId" />
        </UiTabsContent>

        <UiTabsContent value="passphraseReset" class="space-y-4 py-8">
          <PassphraseReset :phone="data?.phone" :customerId="customerId" :coreCustomerId="data?.coreCustomerId" />
        </UiTabsContent>

        <UiTabsContent value="unlockCustomer" class="space-y-4 py-8">
          <UnlockCustomer :phone="data?.phone" :customerId="customerId" :coreCustomerId="data?.coreCustomerId" />
        </UiTabsContent>

           <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_DEVICE >
            <UiTabsContent value="devices" class="space-y-4 py-8">
          <CustomersDevices />
        </UiTabsContent>
        </UiPermissionGuard>

        <!-- <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_DEVICE > -->
            <UiTabsContent value="loginHistory" class="space-y-4 py-8">
          <CustomersLoginHistory />
        </UiTabsContent>
        <!-- </UiPermissionGuard> -->

        <UiPermissionGuard :permission=PermissionConstants.READ_CUSTOMER_CONTRACT >
          <UiTabsContent value="contracts" class="space-y-4 py-8">
          <CustomersContracts :coreCustomerId="data?.coreCustomerId || ''" :customerId="customerId"  />
        </UiTabsContent>
        </UiPermissionGuard>

        <UiTabsContent value="CustomerGroups" class="space-y-4 py-8">
          <CustomersCustomerGroups />
        </UiTabsContent>
      </UiTabs>
    </UiCard>
  </div>
</template>

<style lang="css" scoped></style>
