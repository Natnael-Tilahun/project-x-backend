<script lang="ts" setup>
const openItems = ref(["item-1"]);
import { toast } from "~/components/ui/toast";
import { ref, onMounted } from "vue";
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
import PermissionsDialog from "~/components/contracts/Users/PermissionsDialog.vue";

const {
  updateContractCoreCustomerAccountStatus,
  isLoading: isLoadingContractCoreCustomerAccount,
} = useContractsCoreCustomersAccount();

const {
  createNewContractAccount,
  isLoading: isLoadingCreateNewContractAccount,
  isSubmitting,
} = useContractsCoreCustomers();

const { addUserAccounts, isLoading: isLoadingAddUserAccounts } =
  useContractsUsers();

const { updateUserAccountStatus } = useUserAccounts();

const route = useRoute();
const contractId = ref<string>("");
contractId.value = getIdFromPath();

const { getUserAccountByContractUserId, isLoading: isLoadingUserAccounts } =
  useUserAccounts();
const { getContractCoreCustomers, isLoading: isLoadingContractCoreCustomers } =
  useContractsCoreCustomers();

const loading = ref(false);
const isError = ref(false);
const accountsData = ref<any>();
const contractAccountsData = ref<
  { customerId: string; contractAccounts: ContractAccount[] }[]
>([]);
const selectedAccounts = ref<
  {
    accountId: string;
    contractAccountId: string;
    userAccountId?: string;
    enable?: boolean;
  }[]
>([]);
const props = defineProps<{
  userId?: string;
  contractUserId?: string;
  contract?: any;
}>();

const userAccountPermissions = ref<{ [userAccountId: string]: string[] }>({});

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
  return data;
};

const getUserAccountByContractUserIdHandler = async () => {
  try {
    loading.value = true;
    if (props.contractUserId) {
      const response = await getUserAccountByContractUserId(
        props.contractUserId || ""
      );

      // Map the contract accounts and store their user account IDs
      const userAccounts = response || [];

      // Create a mapping of contract account IDs to user account IDs
      selectedAccounts.value = userAccounts.map((userAccount: any) => ({
        accountId: userAccount.account?.id || "",
        contractAccountId:
          userAccount.contractAccountId || userAccount.account?.id,
        userAccountId: userAccount.id, // Use the user account ID
        enable: userAccount.enable,
      }));

      // Reset permissions store to avoid stale data
      userAccountPermissions.value = {};

      // Initialize permissions for existing user accounts (using codes)
      userAccounts.forEach((userAccount: any) => {
        if (userAccount.id && userAccount.permissions) {
          // Make sure we're using the 'code' property from each permission
          userAccountPermissions.value[userAccount.id] = userAccount.permissions
            .filter((p: any) => p.code) // Only include permissions with a code
            .map((p: any) => p.code);
        }
      });

      // Filter available accounts to exclude those already selected
      accountsData.value = accountsData.value.filter(
        (acc: Account) =>
          !selectedAccounts.value.some(
            (selectedAcc) => selectedAcc.accountId === acc.id
          )
      );
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

    // Structure data as customer -> contract accounts
    contractAccountsData.value = response.map((item: any) => {
      return {
        coreCustomerId: item.id,
        customerId: item.coreCustomerId,
        contractAccounts:
          item.coreAccounts?.map((coreAccount: any) => ({
            id: coreAccount.id,
            enable: coreAccount.enable,
            permissions: coreAccount.permissions,
            account: coreAccount.account,
          })) || [],
      };
    });

    // Keep accountsData for backward compatibility
    accountsData.value = contractAccountsData.value;

    // Filter out any selected accounts from contractAccountsData
    if (selectedAccounts.value.length > 0) {
      contractAccountsData.value = contractAccountsData.value.map(
        (customer: any) => {
          return {
            ...customer,
            contractAccounts: customer.contractAccounts.filter(
              (contractAcc: ContractAccount) =>
                !selectedAccounts.value.some(
                  (selectedAcc) =>
                    selectedAcc.contractAccountId === contractAcc.id
                )
            ),
          };
        }
      );
    }
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
});

const initializePermissions = (
  contractAccount: ContractAccount,
  userAccountId?: string
) => {
  if (!contractAccount.id) return;

  // If we have a user account ID, use that for permissions
  const id = userAccountId || contractAccount.id;

  // Initialize with empty array (no permissions selected initially)
  userAccountPermissions.value[id] = [];
};

const getPermissionId = (account: {
  contractAccountId: string;
  userAccountId?: string;
}) => {
  return account.userAccountId || account.contractAccountId;
};

const handleAccountSelect = (contractAccount: ContractAccount) => {
  if (!contractAccount || !contractAccount.id) return;

  const index = selectedAccounts.value.findIndex(
    (a) => a.contractAccountId === contractAccount.id
  );

  if (index === -1) {
    // Add to selected accounts
    selectedAccounts.value.push({
      accountId: contractAccount.account?.id || "",
      contractAccountId: contractAccount.id,
      // userAccountId will be assigned when created/fetched
    });

    // Initialize permissions using contract account ID for now
    initializePermissions(contractAccount);
  } else {
    const account = selectedAccounts.value[index];
    const permissionId = getPermissionId(account);

    // Remove from selected accounts
    selectedAccounts.value.splice(index, 1);

    // Remove permissions for this account
    if (permissionId in userAccountPermissions.value) {
      delete userAccountPermissions.value[permissionId];
    }
  }
};

const isAccountSelected = (contractAccount: ContractAccount) => {
  if (!contractAccount || !contractAccount.id) return false;

  return selectedAccounts.value.some(
    (a) => a.contractAccountId === contractAccount.id
  );
};

// Get available permissions for a contract account
const getAvailablePermissions = (contractAccountId: string) => {
  const contractAccount = contractAccountsData.value
    .flatMap((customer) => customer.contractAccounts)
    .find((acc) => acc.id === contractAccountId);

  return contractAccount?.permissions || [];
};

// Get the selected permissions for an account - handle both new and existing accounts
const getSelectedPermissions = (id: string) => {
  if (!id) return [];

  // Ensure we have an entry for this ID
  if (!userAccountPermissions.value[id]) {
    userAccountPermissions.value[id] = [];
  }

  // Create a new array to ensure reactivity
  return [...userAccountPermissions.value[id]];
};

const addAccounts = async () => {
  try {
    isSubmitting.value = true;
    loading.value = true;

    const newValues = {
      contractAccounts: selectedAccounts.value.map(
        (account) => account.contractAccountId
      ),
    };

    // Make your API call here to add the accounts with permissions
    const response = await addUserAccounts(
      props.contractUserId || "",
      newValues
    );
    
    await fetchContractCoreCustomers();
    await getUserAccountByContractUserIdHandler();

    // Clear selected accounts and permissions after adding
    selectedAccounts.value = [];
    userAccountPermissions.value = {};

    toast({
      title: "User Accounts Added",
      description: "User accounts with permissions added successfully",
    });
  } catch (err: any) {
    console.error("Error adding user accounts:", err.message);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
};

const updatingUserAccountStatus = async (id: string, status: boolean) => {
  try {
    loading.value = true;
    if (id) {
      const value = status ? "enable" : "disable";
      await updateUserAccountStatus(id, value);
      toast({
        title: "Contract Account Status Updated.",
        description: "Contract Account staus updated successfully",
      });
      await refetchPage();
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
  if (!customer || !customer.contractAccounts) return;

  // Check if all accounts of this customer are already selected
  const allSelected = customer.contractAccounts.every(
    (contractAccount: ContractAccount) => isAccountSelected(contractAccount)
  );

  if (allSelected) {
    // If all are selected, deselect all
    customer.contractAccounts.forEach((contractAccount: ContractAccount) => {
      const index = selectedAccounts.value.findIndex(
        (a) => a.contractAccountId === contractAccount.id
      );
      if (index !== -1) {
        selectedAccounts.value.splice(index, 1);
      }
    });
  } else {
    // Otherwise, select all unselected accounts
    customer.contractAccounts.forEach((contractAccount: ContractAccount) => {
      if (!isAccountSelected(contractAccount)) {
        selectedAccounts.value.push({
          accountId: contractAccount.account?.id || "",
          contractAccountId: contractAccount.id || "",
        });
      }
    });
  }
};

const getCustomerSelectionState = (customer: any) => {
  if (
    !customer ||
    !customer.contractAccounts ||
    customer.contractAccounts.length === 0
  )
    return false;

  const selectedCount = customer.contractAccounts.filter(
    (contractAccount: ContractAccount) => isAccountSelected(contractAccount)
  ).length;

  if (selectedCount === 0) return false;
  if (selectedCount === customer.contractAccounts.length) return true;
  return "indeterminate"; // For partially selected state
};

// Get the selected contract account object by ID
const getSelectedContractAccount = (contractAccountId: string) => {
  return contractAccountsData.value
    .flatMap((customer) => customer.contractAccounts)
    .find((acc) => acc.id === contractAccountId);
};

const permissionsDialogOpen = ref(false);
const currentEditingAccount = ref<{
  contractAccount: ContractAccount | null;
  permissionId: string;
}>({ contractAccount: null, permissionId: "" });

// Open the permissions dialog for a specific account
const openPermissionsDialog = async (selectedAccount: {
  contractAccountId: string;
  userAccountId?: string;
}) => {
  const contractAccount = await getSelectedContractAccount(
    selectedAccount.contractAccountId
  );
  if (!contractAccount) {
    console.error(
      "Could not find contract account:",
      selectedAccount.contractAccountId
    );
    return;
  }

  const permissionId = getPermissionId(selectedAccount);

  // Get current permissions for this account (ensure it's initialized)
  if (!userAccountPermissions.value[permissionId]) {
    userAccountPermissions.value[permissionId] = [];
  }

  // Force reactivity by creating a new object reference
  currentEditingAccount.value = {
    contractAccount: { ...contractAccount },
    permissionId,
  };

  // Delay opening the dialog slightly to ensure data is ready
  setTimeout(() => {
    permissionsDialogOpen.value = true;
  }, 50);
};

// Update permissions from dialog
const savePermissions = (data: { id?: string; permissions: string[] }) => {
  if (!data.id) return;

  // Make sure userAccountPermissions is initialized for this ID
  if (!userAccountPermissions.value[data.id]) {
    userAccountPermissions.value[data.id] = [];
  }

  // Replace the permissions for this ID with the new permissions
  userAccountPermissions.value[data.id] = [...data.permissions];
};

const refetchPage = async () => {
  await fetchContractCoreCustomers();
  await getUserAccountByContractUserIdHandler();
}
</script>

<template>
  <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Add User Accounts</h2>
      </div>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col space-y-8">
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
                selectedAccounts.length > 0) &&
              !loading
            "
            class="w-full flex flex-col border-none gap-2"
          >
            <UiAccordion type="single" collapsible v-model:value="openItems">
              <template
                v-for="(customer, customerIndex) in accountsData"
                :key="customer.coreCustomerId"
              >
                <UiAccordionItem
                  :value="`customer-${customerIndex}`"
                  class="border rounded-lg mb-4 data-[state=open]:bg-muted/50"
                >
                  <div
                    class="flex items-center px-4 py-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div class="flex items-center gap-4 w-full">
                      <!-- Add parent checkbox -->
                      <UiCheckbox
                        :checked="getCustomerSelectionState(customer) === true"
                        :indeterminate="
                          getCustomerSelectionState(customer) ===
                          'indeterminate'
                        "
                        @click="handleCustomerSelect(customer)"
                        class="h-5 w-5 mr-3"
                      />

                      <div class="flex-1 gap-4 py-0 w-full">
                        <UiAccordionTrigger class="w-full text-left">
                          <div class="w-full">
                            <p class="text-sm text-muted-foreground">
                              Customer Id
                            </p>
                            <p class="font-medium text-sm">
                              {{ customer.customerId }}
                            </p>
                          </div>
                          <div class="w-full">
                            <p class="text-sm text-muted-foreground">
                              Accounts
                            </p>
                            <p class="font-medium text-sm">
                              {{ customer.contractAccounts.length }}
                            </p>
                          </div>
                        </UiAccordionTrigger>
                      </div>
                    </div>
                  </div>

                  <UiAccordionContent class="px-4">
                    <!-- Loop through all accounts under this customer -->
                    <div
                      v-for="contractAccount in customer.contractAccounts"
                      :key="contractAccount.id"
                    >
                      <!-- Different UI for selected vs unselected accounts -->
                      <div
                        v-if="isAccountSelected(contractAccount)"
                        class="border rounded-lg mb-4 overflow-hidden"
                      >
                        <!-- Selected Account UI (similar to previous selected accounts section) -->
                        <div
                          class="bg-muted/30 px-6 py-3 flex justify-between items-center"
                        >
                        <UiCheckbox
                              :checked="true"
                              @click="handleAccountSelect(contractAccount)"
                              class="h-5 w-5 mr-8"
                            />
                          <div
                            class="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1"
                          >
                            <div class=" w-full">
                              <p class="text-sm text-muted-foreground">
                                Account Number
                              </p>
                              <p class="font-medium">
                                {{ contractAccount.account?.accountNumber }}
                              </p>
                            </div>
                            <div class=" w-full">
                              <p class="text-sm text-muted-foreground">
                                Account Holder
                              </p>
                              <p class="font-medium">
                                {{
                                  displayApiDataOnLabel(
                                    contractAccount.account?.accountHolder
                                  )
                                }}
                              </p>
                            </div>
                            <div class=" w-full">
                              <p class="text-sm text-muted-foreground">
                                Account Category
                              </p>
                              <p class="font-medium">
                                {{
                                  displayApiDataOnLabel(
                                    contractAccount.account?.accountCategory?.description
                                  )
                                }}
                              </p>
                            </div>
                            <div class="flex w-full col-span-2 justify-between items-start gap-8">
                            <div class="flex gap-0 justify-center w-full">
                              <FormField
                                :model-value="
                                  selectedAccounts.find(
                                    (a) =>
                                      a.contractAccountId === contractAccount.id
                                  )?.enable
                                "
                                v-slot="{ handleChange }"
                                name="enable"
                              >
                                <FormItem>
                                  <FormLabel> Enable </FormLabel>
                                  <FormControl>
                                    <UiSwitch
                                      :checked="
                                        selectedAccounts.find(
                                          (a) =>
                                            a.contractAccountId ===
                                            contractAccount.id
                                        )?.enable
                                      "
                                      @update:checked="
                                        (checked) => {
                                          handleChange;
                                          updatingUserAccountStatus(
                                            selectedAccounts.find(
                                              (a) =>
                                                a.contractAccountId ===
                                                contractAccount.id
                                            )?.userAccountId || '',
                                            checked
                                          );
                                        }
                                      "
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </FormField>
                            </div>
                            <div class="flex gap-2 self-center justify-end items-center w-full">
                              <!-- Permissions button -->
                              <UiButton
                                variant="outline"
                                size="sm"
                                @click="
                                  openPermissionsDialog({
                                    contractAccountId: contractAccount.id,
                                    userAccountId: selectedAccounts.find(
                                      (a) =>
                                        a.contractAccountId ===
                                        contractAccount.id
                                    )?.userAccountId,
                                  })
                                "
                              >
                                <Icon
                                  name="lucide:shield"
                                  class="h-4 w-4 mr-2"
                                />
                                Permissions
                                <span
                                  v-if="
                                    getSelectedPermissions(
                                      getPermissionId({
                                        contractAccountId: contractAccount.id,
                                        userAccountId: selectedAccounts.find(
                                          (a) =>
                                            a.contractAccountId ===
                                            contractAccount.id
                                        )?.userAccountId,
                                      })
                                    ).length > 0
                                  "
                                  class="ml-2 bg-primary text-primary-foreground rounded-full text-xs px-2"
                                >
                                  {{
                                    getSelectedPermissions(
                                      getPermissionId({
                                        contractAccountId: contractAccount.id,
                                        userAccountId: selectedAccounts.find(
                                          (a) =>
                                            a.contractAccountId ===
                                            contractAccount.id
                                        )?.userAccountId,
                                      })
                                    ).length
                                  }}
                                </span>
                              </UiButton>

                              <!-- Remove button -->
                              <UiButton
                                variant="ghost"
                                size="icon"
                                @click="handleAccountSelect(contractAccount)"
                              >
                                <Icon name="lucide:x" class="h-5 w-5 bg-red-500 text-white rounded-sm" />
                              </UiButton>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>

                      <!-- Regular unselected account UI -->
                      <div
                        v-else
                        class="grid grid-cols-2 md:grid-cols-3 items-start text-center gap-6 w-full px-6 py-4 border-t"
                      >
                        <div class="flex items-center w-full">
                          <UiCheckbox
                            :checked="false"
                            @click="handleAccountSelect(contractAccount)"
                            class="h-5 w-5 mr-8"
                          />
                        <div>
                          <p class="text-sm text-muted-foreground text-left">
                            Account Number
                          </p>
                          <p class="font-medium text-left">
                            {{ contractAccount.account?.accountNumber }}
                          </p>
                        </div>
                      </div>
                        <div>
                          <p class="text-sm text-muted-foreground text-left">
                            Account Holder
                          </p>
                          <p class="font-medium text-left">
                            {{
                              displayApiDataOnLabel(
                                contractAccount.account?.accountHolder
                              )
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground text-left">
                            Account Category
                          </p>
                          <p class="font-medium text-left">
                            {{
                              displayApiDataOnLabel(
                                contractAccount.account?.accountCategory?.description
                              )
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </UiAccordionContent>
                </UiAccordionItem>
              </template>
            </UiAccordion>
            <div class="flex justify-between items-center">
              <p class="text-sm text-muted-foreground">
                {{ selectedAccounts.length }} selected
              </p>
              <UiButton
                @click="addAccounts"
                type="submit"
                class="w-fit self-end px-8"
              >
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>
                Save User Accounts
              </UiButton>
            </div>
          </UiCard>

          <UiCard
            v-else-if="accountsData && accountsData.length === 0 && !loading"
            class="w-full p-6 text-center"
          >
            <p class="text-muted-foreground">
              No accounts found for this customer
            </p>
          </UiCard>
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>

  <!-- Add the permissions dialog component with updated props -->
  <PermissionsDialog
    v-if="currentEditingAccount.contractAccount"
    v-model:open="permissionsDialogOpen"
    :contract-account="currentEditingAccount.contractAccount"
    :permission-id="currentEditingAccount.permissionId"
    :selected-permissions="
      getSelectedPermissions(currentEditingAccount.permissionId)
    "
    :available-permissions="
      getAvailablePermissions(currentEditingAccount.contractAccount.id || '')
    "
    :is-user-account="
      !!selectedAccounts.find(
        (acc) => acc.userAccountId === currentEditingAccount.permissionId
      )
    "
    @refetch="refetchPage"
  />
</template>

<style lang="css" scoped></style>
