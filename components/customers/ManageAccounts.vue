<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { ref } from "vue";
import { toast } from "~/components/ui/toast";

const { getCoreAccountsByCustomerId, isLoading } = useCustomers();

const loading = ref(isLoading.value);
const isError = ref(false);
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
const selectedAccounts = ref<Account[]>([]);
const selectedAccountId = ref<string>("");
const showAccountDetails = ref(false);

// Update the interface to match the actual data structure
interface Account {
  accountNumber: string;
  customerId: string;
  accountCategoryId: string;
  accountTitle1: string;
  jointAccountHolder1: string | null;
  jointAccountHolder2: string | null;
  currency: string;
  onlineActualBalance: string;
  onlineClearedBalance: string;
  workingBalance: string;
  openingDate: string;
  dateLastUpdate: string;
  inactivMarker: string;
  postingRestrictId: string;
  accountType: string | null;
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

const searchCoreAccountsByCustomerIdHandler = async () => {
  try {
    loading.value = true;
    console.log("coreCustomerId.value: ", coreCustomerId.value);
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value); // Call your API function to fetch roles
      console.log("response: ", response);
      accountsData.value = response;
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

const handleAccountSelect = (account: Account) => {
  const index = selectedAccounts.value.findIndex(
    (a) => a.accountNumber === account.accountNumber
  );

  if (index === -1) {
    selectedAccounts.value.push(account);
  } else {
    selectedAccounts.value.splice(index, 1);
  }
};

const isAccountSelected = (account: Account) => {
  return selectedAccounts.value.some(
    (a) => a.accountNumber === account.accountNumber
  );
};
</script>

<template>
  <div class="flex flex-col space-y-8">
    <div class="flex gap-8 items-center">
      <div class="grid w-full max-w-sm items-center gap-2">
        <UiLabel for="search" class="font-normal text-muted-foreground"
          >Find account by customer id</UiLabel
        >
        <div class="flex items-center gap-4">
          <UiInput
            id="search"
            type="search"
            placeholder="Search..."
            class="md:w-[100px] lg:w-[300px]"
            v-model="coreCustomerId"
          />
          <UiButton
            :disabled="coreCustomerId == '' || loading"
            @click="searchCoreAccountsByCustomerIdHandler"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </div>
    </div>

    <UiCard
      class="grid lg:grid-cols-4 gap-4 md:gap-8 w-full p-6"
      v-if="loading"
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

    <UiCard
      v-if="accountsData && accountsData.length > 0"
      class="w-full flex flex-col gap-4 p-6"
    >
      <!-- <div class="p-6"> -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Associated Accounts</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
      </div>

      <UiAccordion type="single" collapsible v-model:value="openItems">
        <UiAccordionItem
          v-for="(account, index) in accountsData"
          :key="account.accountNumber"
          :value="`item-${index + 1}`"
          class="border rounded-lg mb-2 data-[state=open]:bg-muted/50"
        >
          <div
            class="flex items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-muted/50': isAccountSelected(account) }"
            @click.stop="handleAccountSelect(account)"
          >
            <div class="flex items-center gap-4 w-full">
              <UiCheckbox
                :checked="isAccountSelected(account)"
                @click.stop="handleAccountSelect(account)"
                class="h-5 w-5"
              />
              <div class="flex-1 grid grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-muted-foreground">Account Number</p>
                  <p class="font-medium">{{ account.accountNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Title</p>
                  <p class="font-medium">{{ account.accountTitle1 }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Balance</p>
                  <p class="font-medium">
                    {{ account.onlineActualBalance }} {{ account.currency }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Opening Date</p>
                  <p class="font-medium">
                    {{ new Date(account.openingDate).toLocaleDateString() }}
                  </p>
                </div>
              </div>
              <UiAccordionTrigger class="ml-auto" />
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t"
            >
              <div>
                <p class="text-sm text-muted-foreground">Customer ID</p>
                <p class="font-medium">{{ account.customerId }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Category</p>
                <p class="font-medium">{{ account.accountCategoryId }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Joint Holder 1</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account.jointAccountHolder1) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Joint Holder 2</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account.jointAccountHolder2) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Cleared Balance</p>
                <p class="font-medium">
                  {{ account.onlineClearedBalance }} {{ account.currency }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Working Balance</p>
                <p class="font-medium">
                  {{ account.workingBalance }} {{ account.currency }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Updated</p>
                <p class="font-medium">
                  {{ new Date(account.dateLastUpdate).toLocaleDateString() }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Type</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account.accountType) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Inactive Marker</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account.inactivMarker) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Posting Restrict Id</p>
                <p class="font-medium">
                  {{ account.postingRestrictId || "-" }}
                </p>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
      <!-- </div> -->
      <UiButton class="w-fit self-end px-8">UnLink</UiButton>
    </UiCard>

    <UiCard
      v-else-if="accountsData && accountsData.length === 0"
      class="w-full p-6 text-center"
    >
      <p class="text-muted-foreground">No accounts found for this customer</p>
    </UiCard>
  </div>
</template>

<style lang="css" scoped></style>
