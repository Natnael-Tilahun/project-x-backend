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

const loading = ref(isLoading.value);
const isError = ref(false);
const errorMessage = ref("");
const accountsData = ref<any>();
const coreCustomerId = ref<string>();
const contractCoreCustomerId = ref<any>();
const selectedAccounts = ref<Account[]>([]);
const selectedContractAccount = ref<ContractAccount[]>([]);
const coreCustomerPermissions = ref<any>();
const store = useAuthStore();

const props = defineProps<{
  contractId?: string;
  contractCoreCustomerProps: any;
  coreCustomerPermissions?: any;
}>();
const emit = defineEmits(["refresh"]);

const refetch = async () => {
  await emit("refresh");
};

console.log("props dataaa: ", props.contractCoreCustomerProps)

coreCustomerId.value = props.contractCoreCustomerProps.coreCustomerId;
contractCoreCustomerId.value = props.contractCoreCustomerProps.id;
coreCustomerPermissions.value = props.coreCustomerPermissions || [];

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
    isError.value = false;
    accountsData.value = [];
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
    isError.value = true;
    console.error("Error fetching accounts:", err);
    errorMessage.value = err.message == "404 NOT_FOUND" ? "Account not found." : err.message;
    toast({
      title: "Uh oh! Something went wrong.",
      description: `${
        err.message == "404 NOT_FOUND" ? "Account not found." : err.message
      }`,
      variant: "destructive",
    });
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
};

const fetchContractCoreCustomerAccounts = async () => {
  try {
    loading.value = true;
    if (coreCustomerId.value) {
      // Get accounts from props instead of API
      const contractAccount = props.contractCoreCustomerProps.coreAccounts;
      console.log("contractAccounts: ", contractAccount);
      
      selectedContractAccount.value = contractAccount;
      selectedAccounts.value = contractAccount || [];
      
      // Filter out already selected accounts from accountsData
      if (accountsData.value) {
        accountsData.value = accountsData.value.filter(
          (acc: Account) =>
            !selectedAccounts.value.some(
              (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
            )
        );
      }
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error processing contract core customers accounts:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getContractCoreCustomerAccountsByIdHandler();
  await fetchContractCoreCustomerAccounts();
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
      coreAccounts: selectedAccounts.value.map((account: Account) => ({
        accountNumber: account.accountNumber,
        inheritContractCustomerPermissions: true,
        permissionCodes: [],
      })),
    };
    console.log(newValues);
    const response = await createNewContractAccount(
      contractCoreCustomerId.value,
      newValues
    ); // Call your API function to fetch profile
    emit("refresh");
    await getContractCoreCustomerAccountsByIdHandler();
    await fetchContractCoreCustomerAccounts();
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
      await fetchContractCoreCustomerAccounts();
      emit("refresh");
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
  <div class="flex flex-col space-y-8">
    <div class="flex gap-8 items-center">
      <div class="grid w-full max-w-sm items-center gap-2">
        <UiLabel for="search" class="font-normal text-muted-foreground"
          >Find account by customer id</UiLabel
        >
        <div class="flex items-center gap-4">
          <UiInput
            id="search"
            type="number"
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

      class="w-full flex flex-col border-none gap-2"
    >
      <!-- <div class="p-6"> -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Add Core Customer Accounts</h2>
        <p class="text-sm text-muted-foreground">
          {{ selectedAccounts.length }} selected
        </p>
      </div>

      <UiAccordion
      v-if="
        ((accountsData && accountsData.length > 0)  ||
        selectedContractAccount.length > 0) &&  !loading && !isError
      "
      type="single" collapsible v-model:value="openItems">
        <UiAccordionItem
          v-for="(account, index) in selectedContractAccount"
          :key="account?.accountNumber"
          :value="`item-${index + 1}`"
          class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
        >
          <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4 w-full">
              <UiCheckbox
                :checked="isAccountSelected(account)"
                @click.stop="handleAccountSelect(account)"
                class="h-5 w-5"
                :disabled="(isAccountSelected(account) && !store.permissions.includes('DELETE_CONTRACT_ACCOUNTS')) || (!isAccountSelected(account) && !store.permissions.includes('CREATE_CONTRACT_ACCOUNTS'))"
              />
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

                <UiPermissionGuard permission="UPDATE_CONTRACT_ACCOUNTS">
                  <FormField
                    :model-value="account.enable"
                    v-slot="{ handleChange }"
                    name="enable"
                  >
                    <FormItem>
                      <FormLabel>Enable</FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="account.enable"
                          @update:checked="
                            (checked) => {
                              handleChange;
                              updatingContractAccountStatus(account.id, checked);
                            }
                          "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </UiPermissionGuard>

                <UiPermissionGuard permission="VIEW_CONTRACT_ACCOUNTS_PERMISSIONS">
                  <div class="flex items-center">
                    <UiSheet>
                      <UiSheetTrigger>
                        <UiButton
                          size="sm"
                          class="font-medium cursor-pointer px-2 h-fit py-1 bg-[#8C2A7C]/15 text-primary hover:bg-[#8C2A7C]/20"
                        >
                          <Icon name="lucide:shield" class="h-4 w-4 mr-2" />
                          Permissions
                        </UiButton>
                      </UiSheetTrigger>
                      <UiSheetContent
                        class="md:min-w-[75%] sm:min-w-full flex flex-col h-full overflow-y-auto"
                      >
                        <ContractsAccountsPermissions
                          :contractAccountId="account.id"
                          :coreCustomerPermissions="coreCustomerPermissions"
                          :accountPermissions="account.permissions"
                          :contractId="contractId"
                          @refresh="refetch"
                        />
                      </UiSheetContent>
                    </UiSheet>
                  </div>
                </UiPermissionGuard>
              </div>
              <UiAccordionTrigger />
            </div>
          </div>

          <UiAccordionContent class="px-4 pb-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t">
              <div>
                <p class="text-sm text-muted-foreground">Account Category</p>
                <p class="font-medium">{{ account?.accountCategory?.shortName }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Currency</p>
                <p class="font-medium">{{ account?.currencyCode }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Available Balance</p>
                <p class="font-medium">{{ account?.availableBalance }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">Last Updated</p>
                <p class="font-medium">
                  {{ new Date(account?.lastUpdated).toLocaleDateString() }}
                </p>
              </div>
              <!-- Add other account details as needed -->
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
                :disabled="(isAccountSelected(account) && !store.permissions.includes('DELETE_CONTRACT_ACCOUNTS')) || (!isAccountSelected(account) && !store.permissions.includes('CREATE_CONTRACT_ACCOUNTS'))"
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

  <UiPermissionGuard permission="CREATE_CONTRACT_ACCOUNTS" >
        <div class="flex justify-end pt-4">
      <UiButton @click="addAccounts" type="submit" class="w-fit self-end px-8">Add Accounts</UiButton>
      </div>
      </UiPermissionGuard>
      </UiAccordion>
      <!-- </div> -->
      <UiCard
      v-else-if="accountsData && accountsData.length === 0 && !loading && !isError"
      class="w-full p-6 text-center"
    >
      <p class="text-muted-foreground py-8">No accounts found for this customer</p>
    </UiCard>
    <div class="w-full" v-else-if="isError">
      <ErrorMessage :title="errorMessage || 'Something went wrong.'" />
    </div>

      
    </UiCard>

  
  </div>
</template>

<style lang="css" scoped></style>
