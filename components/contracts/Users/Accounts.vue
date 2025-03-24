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

const { getCoreAccountsByCustomerId, isLoading } = useCustomers();
const { getUserAccountByContractUserId, isLoading: isLoadingUserAccounts } = useUserAccounts();

const { addUserAccounts, isLoading: isLoadingAddUserAccounts } = useContractsUsers();

const { getContractCoreCustomers, isLoading: isLoadingContractCoreCustomers } = useContractsCoreCustomers();

const loading = ref(isLoading.value);
const isError = ref(false);
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const contractCoreCustomerId = ref<any>();
const selectedAccounts = ref<Account[]>([]);
const selectedContractAccount = ref<ContractAccount[]>([]);
const coreCustomerPermissions = ref<any>();
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

const searchCoreAccountsByCustomerIdHandler = async () => {
  try {
    loading.value = true;
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value); // Call your API function to fetch roles
      accountsData.value = response;
      accountsData.value = accountsData.value.filter(
        (acc: Account) =>
          !selectedAccounts.value.some(
            (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
          )
      );
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

const getUserAccountByContractUserIdHandler = async () => {
  try {
    loading.value = true;
    if (props.contractUserId) {
      const response = await getUserAccountByContractUserId(props.contractUserId);
      console.log("user accounts response: ", response);
      // accountsData.value = response;
      // console.log("accountsData: ", accountsData.value);
      // console.log("contractUserId: ", props.contractUserId);
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error fetching user accounts:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// const fetchContractCoreCustomerAccounts = async () => {
//   try {
//     loading.value = true;
//     if (coreCustomerId.value) {
//       const response = await getContractCoreCustomerAccounts(0, 100000000);
//       const contractAccount = response.filter(
//         (item: any) => item.coreCustomer?.id === contractCoreCustomerId.value
//       );
//       selectedContractAccount.value = contractAccount;
//       selectedAccounts.value =
//         contractAccount.map((item: any) => item.account) || [];
//       accountsData.value = accountsData.value.filter(
//         (acc: Account) =>
//           !selectedAccounts.value.some(
//             (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
//           )
//       );
//     } else {
//       return true;
//     }
//   } catch (err: any) {
//     console.error("Error fetching contract core customers accounts:", err);
//     isError.value = true;
//   } finally {
//     loading.value = false;
//   }
// };

const fetchContractCoreCustomers = async () => {
  try {
    loading.value = true;
    const response = await getContractCoreCustomers(contractId.value);
    
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

    // If you still need accountsData, you can map it separately
    // accountsData.value = response.reduce((acc: any[], item: any) => {
    //   if (item.coreAccounts && Array.isArray(item.coreAccounts)) {
    //     const accounts = item.coreAccounts.map((account: any) => account.account);
    //     return [...acc, ...accounts];
    //   }
    //   return acc;
    // }, []);

    selectedContractAccount.value = response.reduce((acc: any[], item: any) => {
      if (item.coreAccounts && Array.isArray(item.coreAccounts)) {
        const accounts = item.coreAccounts.map((account: any) => ({
          coreCustomerId: item.id,
          account: account.account
        }));
        return [...acc, ...accounts];
      }
      return acc;
    }, []);
;

    console.log("contractCoreCustomerAccounts: ", contractCoreCustomerAccounts.value);
    console.log("accountsData: ", accountsData.value);
    console.log("selectedAccounts: ", selectedAccounts.value);
  } catch (err: any) {
    console.error("Error fetching contract core customers:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
    
onMounted(async () => {
  // await getContractCoreCustomerAccountsByIdHandler();
  // await fetchContractCoreCustomerAccounts();
  await fetchContractCoreCustomers();
  await getUserAccountByContractUserIdHandler();
});

const handleAccountSelect = (account: Account | undefined) => {
  const index = selectedAccounts.value.findIndex(
    (a) => a.accountNumber === account?.accountNumber
  );

  if (index === -1) {
    selectedAccounts.value.push(account as Account);
  } else {
    selectedAccounts.value.splice(index, 1);
  }
};

const isAccountSelected = (account: Account | undefined) => {
  return selectedAccounts.value.some(
    (a) => a.accountNumber === account?.accountNumber
  );
};

const addAccounts = async () => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      contractAccounts: selectedAccounts.value.map((account: Account) => (
        account.accountNumber
      )),
    };

    console.log(newValues);
    const response = await addUserAccounts(
      props.contractUserId || '',
      newValues
    ); // Call your API function to fetch profile
    console.log("response: ", response);
    await fetchContractCoreCustomers();
    await getUserAccountByContractUserIdHandler();
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
</script>

<template>
    <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <!-- <UiSheetTitle class="border-b-2"
        >Contract Account </UiSheetTitle
      > -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Add Core Customer Accounts</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
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
        <UiAccordionItem
          v-for="(
            { account, enable, id, permissions }, index
          ) in selectedContractAccount"
          :key="account?.accountNumber"
          :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
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
              <!-- <UiAccordionTrigger class="ml-auto hover:no-underline"> -->
              <div class="flex-1 grid grid-cols-4 gap-4 py-2">
                <div>
                  <p class="text-sm text-muted-foreground">Account Number</p>
                  <p class="font-medium text-sm">
                    {{ account?.accountNumber }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Title</p>
                  <p class="font-medium text-sm">
                    {{ account?.accountHolder }}
                  </p>
                </div>
                <FormField
                  :model-value="enable"
                  v-slot="{ handleChange }"
                  name="enable"
                >
                  <FormItem>
                    <FormLabel> Enable </FormLabel>
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
                <div class="flex items-center">
                  <UiSheet>
                    <UiSheetTrigger>
                      <UiButton
                        size="sm"
                        class="font-medium cursor-pointer px-2 h-fit py-1"
                      >
                        Permissions
                      </UiButton>
                    </UiSheetTrigger>
                    <UiSheetContent
                      class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
                    >
                      <UserAccountsPermissions
                        :userAccountId="id"
                        :accountPermissions="permissions"
                        @refresh="refetch"
                      />
                    </UiSheetContent>
                  </UiSheet>
                </div>
              </div>
              <UiAccordionTrigger />
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div
              class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t"
            >
              <div>
                <p class="text-sm text-muted-foreground">Customer ID</p>
                <p class="font-medium">{{ account?.customerId }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Category</p>
                <p class="font-medium">{{ account?.accountCategoryId }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Joint Holder 1</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account?.jointAccountHolder1) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Joint Holder 2</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account?.jointAccountHolder2) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Cleared Balance</p>
                <p class="font-medium">
                  {{ account?.onlineClearedBalance }} {{ account?.currency }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Updated</p>
                <p class="font-medium">
                  {{ new Date(account?.lastUpdated).toLocaleDateString() }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Account Type</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account?.accountType) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Inactive Marker</p>
                <p class="font-medium">
                  {{ displayApiDataOnLabel(account?.inactivMarker) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Posting Restrict Id</p>
                <p class="font-medium">
                  {{ account?.postingRestrictId || "-" }}
                </p>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem
          v-for="(account, index) in accountsData"
          :key="account?.accountNumber"
          :value="`item-${index + 2}`"
          class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
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
              <!-- <UiAccordionTrigger class="ml-auto hover:no-underline"> -->
              <div class="flex-1 grid grid-cols-4 gap-4 py-2">
                <div>
                  <p class="text-sm text-muted-foreground">Account Number</p>
                  <p class="font-medium text-sm">
                    {{ account?.accountNumber }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground">Account Title</p>
                  <p class="font-medium text-sm">
                    {{ account?.accountTitle1 }}
                  </p>
                </div>

                <div>
                  <p class="text-sm text-muted-foreground">Opening Date</p>
                  <p class="font-medium text-sm">
                    {{
                      new Date(account?.openingDate || "").toLocaleDateString()
                    }}
                  </p>
                </div>
              </div>
              <UiAccordionTrigger />
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
      <UiButton @click="addAccounts" type="submit" class="w-fit self-end px-8">Add Accounts</UiButton>
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
