<!-- <script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "~/components/contracts/Accounts/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath } from "~/lib/utils";
import type { ContractAccount, Contract } from "~/types";

const { getContractCoreCustomerAccounts, getContractCoreCustomerAccountById, isLoading } = useContractsCoreCustomersAccount();
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ContractAccount[]>([]);
const keyword = ref<string>("");
const route = useRoute();
const contractId = ref<string>("");


contractId.value = getIdFromPath();
console.log("contractIdFromPathdd", contractId.value);

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const contracts = await getContractCoreCustomerAccounts(0, 100000000);
    data.value = contracts;
  } catch (err: any) {
    console.error("Error fetching contract core customers accounts:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchData();
};

await useAsyncData("contractCoreCustomersData", async () => {
  await fetchData();
});

const searchHandler = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value[0] = await getContractCoreCustomerAccountById(keyword.value); // Call your API function to fetch roles
  } catch (err: any) {
    console.error("Error fetching contract core customers accounts:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};
</script> -->

<!-- <template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
      <UiButton   
      @click="
            navigateTo({
              path: route.path,
              query: {
                coreCustomerId: data[0]?.coreCustomer?.id,
                coreCustomerActiveTab: 'newAccount',
              },
            })"
             class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        Contract Core Customer Account</UiButton
      >
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
        <div class="flex items-center gap-4">
          <UiInput
            type="search"
            placeholder="Search by contract id"
            class="md:w-[100px] lg:w-[300px]"
            v-model="keyword"
          />
          <UiButton @click="searchHandler">
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="isLoading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Search</UiButton
          >
        </div>
      </template>
    </UiDataTable>
  </div>
  <div v-if="isError">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template> -->

<script lang="ts" setup>
const openItems = ref(["item-1"]);
import { toast } from "~/components/ui/toast";
import { ref, onMounted } from "vue";
import { columns } from "~/components/contracts/Accounts/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath } from "~/lib/utils";
import type { ContractAccount, Contract } from "~/types";

const { getContractCoreCustomerAccounts, getContractCoreCustomerAccountById, isLoading: isLoadingContractCoreCustomerAccount } = useContractsCoreCustomersAccount();
const { createNewContractAccount, isLoading: isLoadingCreateNewContractAccount, isSubmitting } = useContractsCoreCustomers();
const loadingContractCoreCustomerAccount = ref(isLoadingContractCoreCustomerAccount.value);
const isErrorContractCoreCustomerAccount = ref(false);
const data = ref<ContractAccount[]>([]);
const keyword = ref<string>("");
const route = useRoute();
const contractId = ref<string>("");

contractId.value = getIdFromPath();


const { getCoreAccountsByCustomerId, isLoading } = useCustomers();

const loading = ref(isLoading.value);
const isError = ref(false);
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const contractCoreCustomerId = ref<any>();
const customerId = ref<string>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
const selectedAccounts = ref<Account[]>([]);
const selectedAccountId = ref<string>("");
const showAccountDetails = ref(false);

const props = defineProps<{
  contractId?: string;
  contractCoreCustomerProps: any;
}>();

coreCustomerId.value = props.contractCoreCustomerProps.coreCustomerId;
contractCoreCustomerId.value = props.contractCoreCustomerProps.id;
console.log("contractId: ", contractId.value);
console.log("coreCustomerId: ", coreCustomerId.value);
console.log("contractCoreCustomerId: ", contractCoreCustomerId.value);
console.log("coreCustomer: ", props.contractCoreCustomerProps);
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

const getContractCoreCustomerAccountsByIdHandler = async () => {
  try {
    loading.value = true;
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value);
      accountsData.value = response;
    } else {
      return true;
    }
} catch (err: any) {
    console.error("Error fetching contract core customers accounts:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getContractCoreCustomerAccountsByIdHandler();
});

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

const addAccounts = async () => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = { 
        "coreAccounts": selectedAccounts.value.map((account: Account) => ({
            "accountNumber": account.accountNumber,
        }))
    }
    console.log(newValues);
    const response = await createNewContractAccount(contractId.value, contractCoreCustomerId.value, newValues); // Call your API function to fetch profile
    console.log("response: ", response);
    // navigateTo(`/contracts/${contractId.value}?activeTab=contractCoreCustomersDetails&&coreCustomerId=${coreCustomerId.value}&&coreCustomerActiveTab=accounts`);
    toast({
      title: "Contract Core Customer Account Created",
      description: "Contract Core Customer Account created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new contract account:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
}
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
      class="w-full flex flex-col border-none gap-4"
    >
      <!-- <div class="p-6"> -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Core Customer Accounts</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
      </div>

      <UiAccordion type="single" collapsible v-model:value="openItems">
        <UiAccordionItem
          v-for="(account, index) in accountsData"
          :key="account.accountNumber"
          :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 data-[state=open]:bg-muted/50"
        >
          <div
            class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors"
            
          >
            <div class="flex items-center gap-4 w-full">
              <UiCheckbox
                :checked="isAccountSelected(account)"
                @click.stop="handleAccountSelect(account)"
                class="h-5 w-5"
              />
              <UiAccordionTrigger class="ml-auto">
              <div class="flex-1 grid grid-cols-5 gap-4">
                <div>
                  <p class="text-sm text-muted-foreground">Account Number</p>
                  <p class="font-medium text-sm">{{ account.accountNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Title</p>
                  <p class="font-medium text-sm">{{ account.accountTitle1 }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Balance</p>
                  <p class="font-medium text-sm">
                    {{ account.onlineActualBalance }} {{ account.currency }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Opening Date</p>
                  <p class="font-medium text-sm">
                    {{ new Date(account.openingDate).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </UiAccordionTrigger>
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-4 px-16 py-4 border-t"
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
      <UiButton @click="addAccounts" class="w-fit self-end px-8">Add Accounts</UiButton>
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
