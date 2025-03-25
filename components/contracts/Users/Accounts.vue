<script lang="ts" setup>
const openItems = ref(["item-1"]);
import { toast } from "~/components/ui/toast";
import { ref, onMounted } from "vue";
import { columns } from "~/components/contracts/Accounts/columns";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { getIdFromPath } from "~/lib/utils";
import type { ContractAccount, Contract, Account } from "~/types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

const {
  getContractCoreCustomerAccounts,
  updateContractCoreCustomerAccountStatus,
  isLoading: isLoadingContractCoreCustomerAccount,
} = useContractsCoreCustomersAccount();

const {
  createNewContractAccount,
  isLoading: isLoadingCreateNewContractAccount,
  isSubmitting,
} = useContractsCoreCustomers();
const route = useRoute();
const contractId = ref<string>("");
contractId.value = getIdFromPath();

const { getUserAccountByContractUserId, isLoading: isLoadingUserAccounts } = useUserAccounts();
const { getContractCoreCustomers, isLoading: isLoadingContractCoreCustomers } = useContractsCoreCustomers();

const loading = ref(false);
const isError = ref(false);
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const contractCoreCustomerId = ref<any>();
const selectedAccounts = ref<Account[]>([]);
const selectedContractAccount = ref<ContractAccount[]>([]);
const coreCustomerPermissions = ref<any>();
const coreAccounts = ref<any>();
const props = defineProps<{
    userId?: string;
    contractUserId?: string;
    contract?: any;
}>();

const contractCoreCustomerAccounts = ref<{coreCustomerId: string, account: Account}[]>();

contractId.value = getIdFromPath();

console.log("contractUserId: ", props.contractUserId);
console.log("contract: ", contractId.value);

const emit = defineEmits(["refresh"]);
const refetch = async () => {
  await emit("refresh");
};

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

// const getUserAccountByContractUserIdHandler = async () => {
//   try {
//     loading.value = true;
//     if (props.contractUserId) {
//       const response = await getUserAccountByContractUserId(props.contractUserId);
//       console.log("user accounts response: ", response);
//       // accountsData.value = response;
//       // console.log("accountsData: ", accountsData.value);
//       // console.log("contractUserId: ", props.contractUserId);
//     } else {
//       return true;
//     }
//   } catch (err: any) {
//     console.error("Error fetching user accounts:", err);
//     isError.value = true;
//   } finally {
//     loading.value = false;
//   }
// };

const getUserAccountByContractUserIdHandler= async () => {
  try {
    loading.value = true;
    if (props.contractUserId) {
      const response = await getUserAccountByContractUserId(props.contractUserId || '');
      console.log("getUserAccountByContractUserId response: ", response);
      const contractAccount = response?.map(
        (item: any) => item.account
      );
      selectedContractAccount.value = contractAccount;
      selectedAccounts.value =
        contractAccount.map((item: any) => item.account) || [];
      accountsData.value = accountsData.value.filter(
        (acc: Account) =>
          !selectedAccounts.value.some(
            (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
          )
      );
      console.log("selectedAccounts: ", selectedAccounts.value);
      console.log("accountsData: ", accountsData.value);
      console.log("selectedContractAccount: ", selectedContractAccount.value);
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error fetching contract user accounts:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};



const fetchContractCoreCustomers = async () => {
  try {
    loading.value = true;
    const response = await getContractCoreCustomers(contractId.value);
    console.log("response: ", response);
    // // Flatten and transform the data into the desired structure
    // contractCoreCustomerAccounts.value = response.reduce((acc: any[], item: any) => {
    //   if (item.coreAccounts && Array.isArray(item.coreAccounts)) {
    //     const accounts = item.coreAccounts.map((account: any) => ({
    //       coreCustomerId: item.id,
    //       account: account.account
    //     }));
    //     return [...acc, ...accounts];
    //   }
    //   return acc;
    // }, []);

    // accountsData.value = response.reduce((acc: any[], item: any) => {
    //   if (item.coreAccounts && Array.isArray(item.coreAccounts)) {
    //     const accounts = item.coreAccounts.map((account: any) => account.account);
    //     return [...acc, ...accounts];
    //   }
    //   return acc;
    // }, []);

    // selectedContractAccount.value = response.reduce((acc: any[], item: any) => {
    //   if (item.coreAccounts && Array.isArray(item.coreAccounts)) {
    //     const accounts = item.coreAccounts.map((account: any) => ({
    //       coreCustomerId: item.id,
    //       account: account.account
    //     }));
    //     return [...acc, ...accounts];
    //   }
    //   return acc;
    // }, []);

    coreAccounts.value = response.map((item: any) => {
      return item.coreAccounts;
    });

    console.log("coreAccounts: ", coreAccounts.value);


accountsData.value = response.map((item: any) => {
      return {
        coreCustomerId: item.id,
        customerId: item.coreCustomerId,
        accounts: item.coreAccounts?.map((account: any) => ({
          ...account.account,
          coreCustomerId: item.id,
          accountEnable: account.enable,
          accountId: account.id,
          permissions: account.permissions
        })) || []
      };
    });

    // Filter out any selected accounts from accountsData
    if (selectedAccounts.value.length > 0) {
      accountsData.value = accountsData.value.map((customer: any) => {
        return {
          ...customer,
          accounts: customer.accounts.filter(
            (acc: Account) => !selectedAccounts.value.some(
              (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
            )
          )
        };
      });
    }

    // console.log("contractCoreCustomerAccounts: ", contractCoreCustomerAccounts.value);
    console.log("accountsData: ", accountsData.value);
    console.log("selectedAccounts: ", selectedAccounts.value);
    console.log("selectedContractAccount: ", selectedContractAccount.value);
  } catch (err: any) {
    console.error("Error fetching contract core customers:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
    
onMounted(async () => {
  await fetchContractCoreCustomers();
  await getUserAccountByContractUserIdHandler();
  // await fetchContractUserAccounts();
});

const handleAccountSelect = (account: Account) => {
  if (!account) return;
  
  const index = selectedAccounts.value.findIndex(
    (a) => a.id === account.id && a.accountNumber === account.accountNumber
  );

  if (index === -1) {
    selectedAccounts.value.push(account);
  } else {
    selectedAccounts.value.splice(index, 1);
  }
  console.log("Selected accounts:", selectedAccounts.value);
};

const isAccountSelected = (account: Account) => {
  if (!account) return false;
  
  return selectedAccounts.value.some(
    (a) => a.id === account.id && a.accountNumber === account.accountNumber
  );
};

const addAccounts = async () => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const newValues = {
      contractAccounts: selectedAccounts.value.map((account: Account) => account.id)
    };

    console.log("newValues: ", newValues);
    // Make your API call here to add the accounts
    // const response = await addUserAccounts(props.contractUserId || '', newValues);
    
    await fetchContractCoreCustomers();
    await getUserAccountByContractUserIdHandler();
    
    // Clear selected accounts after adding
    selectedAccounts.value = [];
    
    toast({
      title: "Contract Core Customer Account Created",
      description: "Contract Core Customer Account created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new contract account:", err.message);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
};

const updatingContractAccountStatus = async (id: string, status: boolean) => {
  try {
    loading.value = true;
    if (id) {
      const value = status ? "enable" : "disable";
      console.log("value: ", value);  
      await updateContractCoreCustomerAccountStatus(id, value);
      // await fetchContractCoreCustomerAccounts();
      toast({
        title: "Contract Account Status Updated.",
        description: "Contract Account staus updated successfully",
      });
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error updating contract core account:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// Add these new methods for bulk selection
const handleCustomerSelect = (customer: any) => {
  if (!customer || !customer.accounts) return;
  
  // Check if all accounts of this customer are already selected
  const allSelected = customer.accounts.every((account: Account) => 
    isAccountSelected(account)
  );
  
  if (allSelected) {
    // If all are selected, deselect all
    customer.accounts.forEach((account: Account) => {
      const index = selectedAccounts.value.findIndex(
        (a) => a.id === account.id && a.accountNumber === account.accountNumber
      );
      if (index !== -1) {
        selectedAccounts.value.splice(index, 1);
      }
    });
  } else {
    // Otherwise, select all unselected accounts
    customer.accounts.forEach((account: Account) => {
      if (!isAccountSelected(account)) {
        selectedAccounts.value.push(account);
      }
    });
  }
  
  console.log("Selected accounts after bulk action:", selectedAccounts.value);
};

const getCustomerSelectionState = (customer: any) => {
  if (!customer || !customer.accounts || customer.accounts.length === 0) return false;
  
  const selectedCount = customer.accounts.filter((account: Account) => 
    isAccountSelected(account)
  ).length;
  
  if (selectedCount === 0) return false;
  if (selectedCount === customer.accounts.length) return true;
  return 'indeterminate'; // For partially selected state
};
</script>

<template>
    <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <!-- <UiSheetTitle class="border-b-2"
        >Contract Account </UiSheetTitle
      > -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Add User Accounts</h2>

      </div>
      <UiSheetDescription class="py-4 space-y-4">
  <div class="flex flex-col space-y-8">
    <!-- <div class="flex gap-8 items-center">
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
    </div> -->

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
      v-if="
        ((accountsData && accountsData.length > 0) ||
        selectedContractAccount.length > 0) &&  !loading
      "
      class="w-full flex flex-col border-none gap-2"
    >
      <!-- <div class="p-6"> -->
      <!-- <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Add Core Customer Accounts</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
      </div> -->

      <UiAccordion type="single" collapsible v-model:value="openItems">
        <template v-for="(customer, customerIndex) in accountsData" :key="customer.coreCustomerId">
          <UiAccordionItem
            :value="`customer-${customerIndex}`"
            class="border rounded-lg mb-4 data-[state=open]:bg-muted/50"
          >
            <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div class="flex items-center gap-4 w-full">
                <!-- Add parent checkbox -->
                <UiCheckbox
                  :checked="getCustomerSelectionState(customer) === true"
                  :indeterminate="getCustomerSelectionState(customer) === 'indeterminate'"
                  @click="handleCustomerSelect(customer)"
                  class="h-5 w-5 mr-3"
                />
               
                <div class="flex-1 gap-4 py-4 w-full">
                  <UiAccordionTrigger class="w-full text-left">
                  <!-- <div class="w-full space-y-1">
                    <p class="text-sm  text-muted-foreground">Core Customer ID</p>
                    <p class="font-medium text-sm">{{ customer.coreCustomerId }}</p>
                  </div> -->
                  <div class="w-full space-y-1">
                    <p class="text-sm text-muted-foreground">Customer Id</p>
                    <p class="font-medium text-sm">{{ customer.customerId }}</p>
                  </div>
                  <div class="w-full space-y-1">
                    <p class="text-sm text-muted-foreground">Accounts</p>
                    <p class="font-medium text-sm">{{ customer.accounts.length }}</p>
                  </div>
                </UiAccordionTrigger>
                </div>
              
              </div>
            </div>

            <UiAccordionContent class="px-4 pb-4">
              <div v-for="account in customer.accounts" :key="account.id" 
                   class="grid grid-cols-2 md:grid-cols-3 gap-6 w-full px-6 py-4 border-t">
                <div class="flex items-center w-full">
                  <UiCheckbox
                    :checked="isAccountSelected(account)"
                    @click="handleAccountSelect(account)"
                    class="h-5 w-5 mr-8"
                  />
                  <div>
                    <p class="text-sm text-muted-foreground">Account ID</p>
                    <p class="font-medium">{{ account.id }}</p>
                  </div>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Number</p>
                  <p class="font-medium">{{ account.accountNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Holder</p>
                  <p class="font-medium">{{ displayApiDataOnLabel(account.accountHolder) }}</p>
                </div>
              </div>
            </UiAccordionContent>
          </UiAccordionItem>
        </template>

        <!-- Display already selected accounts -->
        <UiAccordionItem
          v-if="selectedContractAccount && selectedContractAccount.length > 0"
          value="selected-accounts"
          class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
        >
          <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4 w-full">
              <div class="flex-1 py-2">
                <h3 class="font-medium">Selected Accounts ({{ selectedContractAccount.length }})</h3>
              </div>
              <UiAccordionTrigger />
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div
              v-for="({ account, enable, id, permissions }, index) in selectedContractAccount"
              :key="account?.accountNumber"
              class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t"
            >
              <div>
                <p class="text-sm text-muted-foreground">Account ID</p>
                <p class="font-medium">{{ account?.id }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Number</p>
                <p class="font-medium">{{ account?.accountNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Title</p>
                <p class="font-medium">{{ account?.accountHolder }}</p>
              </div>
              <FormField
                :model-value="enable"
                v-slot="{ handleChange }"
                name="enable"
              >
                <FormItem>
                  <FormLabel>Enable</FormLabel>
                  <FormControl>
                    <UiSwitch
                      :checked="enable"
                      @update:checked="
                        (checked) => {
                          handleChange;
                          updatingContractAccountStatus(id || '', checked);
                        }
                      "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
      <!-- </div> -->
      <div class="flex justify-between items-center">
      <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
      <UiButton @click="addAccounts" :disabled="selectedAccounts.length === 0 || isSubmitting" type="submit" class="w-fit self-end px-8">
        <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin"></Icon>
        Add Accounts
      </UiButton>
      </div>
    </UiCard>

    <UiCard
      v-else-if="accountsData && accountsData.length === 0 && !loading"
      class="w-full p-6 text-center"
    >
      <p class="text-muted-foreground">No accounts found for this customer</p>
    </UiCard>
  </div>
</UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
