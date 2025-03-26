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
    import PermissionsDialog from '~/components/contracts/Users/PermissionsDialog.vue';

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

    const {
      addUserAccounts,
      isLoading: isLoadingAddUserAccounts,
    } = useContractsUsers();

    const route = useRoute();
    const contractId = ref<string>("");
    contractId.value = getIdFromPath();

    const { getUserAccountByContractUserId, isLoading: isLoadingUserAccounts } = useUserAccounts();
    const { getContractCoreCustomers, isLoading: isLoadingContractCoreCustomers } = useContractsCoreCustomers();

    const loading = ref(false);
    const isError = ref(false);
    const accountsData = ref<any>();
    const contractAccountsData = ref<{customerId: string, contractAccounts: ContractAccount[]}[]>([]);
    const coreCustomerId = ref<string>();
    const contractCoreCustomerId = ref<any>();
    const selectedAccounts = ref<{accountId: string, contractAccountId: string, userAccountId?: string}[]>([]);
    const selectedContractAccount = ref<ContractAccount[]>([]);
    const coreCustomerPermissions = ref<any>();
    const contractAccounts = ref<any>();
    const props = defineProps<{
        userId?: string;
        contractUserId?: string;
        contract?: any;
    }>();

    const contractCoreCustomerAccounts = ref<{coreCustomerId: string, account: Account}[]>();

    const userAccountPermissions = ref<{[userAccountId: string]: string[]}>({});

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

    const getUserAccountByContractUserIdHandler = async () => {
      try {
        loading.value = true;
        if (props.contractUserId) {
          const response = await getUserAccountByContractUserId(props.contractUserId || '');
          console.log("getUserAccountByContractUserId response: ", response);
          
          // Map the contract accounts and store their user account IDs
          const userAccounts = response || [];
          
          // Create a mapping of contract account IDs to user account IDs
          selectedAccounts.value = userAccounts.map((userAccount: any) => ({
            accountId: userAccount.account?.id || '',
            contractAccountId: userAccount.contractAccountId || userAccount.account?.id,
            userAccountId: userAccount.id // Use the user account ID
          }));
          
          // Reset permissions store to avoid stale data
          userAccountPermissions.value = {};
          
          // Initialize permissions for existing user accounts (using codes)
          userAccounts.forEach((userAccount: any) => {
            if (userAccount.id && userAccount.permissions) {
              // Make sure we're using the 'code' property from each permission
              userAccountPermissions.value[userAccount.id] = 
                userAccount.permissions
                  .filter((p: any) => p.code) // Only include permissions with a code
                  .map((p: any) => p.code);
                  
              console.log(`Loaded permissions for ${userAccount.id}:`, userAccountPermissions.value[userAccount.id]);
            }
          });
          
          // Filter available accounts to exclude those already selected
          accountsData.value = accountsData.value.filter(
            (acc: Account) =>
              !selectedAccounts.value.some(
                (selectedAcc) => selectedAcc.accountId === acc.id
              )
          );
          
          console.log("selectedAccounts with userAccountIds: ", selectedAccounts.value);
          console.log("accountsData: ", accountsData.value);
          console.log("selectedContractAccount: ", selectedContractAccount.value);
          console.log("userAccountPermissions: ", userAccountPermissions.value);
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

        // Structure data as customer -> contract accounts
        contractAccountsData.value = response.map((item: any) => {
          return {
            coreCustomerId: item.id,
            customerId: item.coreCustomerId,
            contractAccounts: item.coreAccounts?.map((coreAccount: any) => ({
              id: coreAccount.id,
              enable: coreAccount.enable,
              permissions: coreAccount.permissions,
              account: coreAccount.account
            })) || []
          };
        });

        // Keep accountsData for backward compatibility
        accountsData.value = contractAccountsData.value;

        // Filter out any selected accounts from contractAccountsData
        if (selectedAccounts.value.length > 0) {
          contractAccountsData.value = contractAccountsData.value.map((customer: any) => {
            return {
              ...customer,
              contractAccounts: customer.contractAccounts.filter(
                (contractAcc: ContractAccount) => !selectedAccounts.value.some(
                  (selectedAcc) => selectedAcc.contractAccountId === contractAcc.id
                )
              )
            };
          });
        }

        console.log("contractAccountsData: ", contractAccountsData.value);
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

    const initializePermissions = (contractAccount: ContractAccount, userAccountId?: string) => {
      if (!contractAccount.id) return;
      
      // If we have a user account ID, use that for permissions
      const id = userAccountId || contractAccount.id;
      
      // Initialize with empty array (no permissions selected initially)
      userAccountPermissions.value[id] = [];
    };

    const getPermissionId = (account: { contractAccountId: string, userAccountId?: string }) => {
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
          accountId: contractAccount.account?.id || '',
          contractAccountId: contractAccount.id
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
      
      console.log("Selected accounts:", selectedAccounts.value);
      console.log("User account permissions:", userAccountPermissions.value);
    };

    const isAccountSelected = (contractAccount: ContractAccount) => {
      if (!contractAccount || !contractAccount.id) return false;
      
      return selectedAccounts.value.some(
        (a) => a.contractAccountId === contractAccount.id
      );
    };

    // Function to toggle a specific permission
    const togglePermission = (contractAccountId: string, permissionId: string) => {
      if (!userAccountPermissions.value[contractAccountId]) {
        userAccountPermissions.value[contractAccountId] = [];
      }
      
      const permissionIndex = userAccountPermissions.value[contractAccountId]
        .findIndex(p => p === permissionId);
        
      if (permissionIndex !== -1) {
        // Remove permission
        userAccountPermissions.value[contractAccountId].splice(permissionIndex, 1);
      } else {
        // Add permission if it's available in the contract account
        const availablePermissions = getAvailablePermissions(contractAccountId);
        if (availablePermissions.some(p => p.code === permissionId)) {
          userAccountPermissions.value[contractAccountId].push(permissionId);
        }
      }
      
      console.log("Updated permissions for", contractAccountId, ":", userAccountPermissions.value[contractAccountId]);
    };

    // Check if a permission is active for a user account
    const isPermissionActive = (contractAccountId: string, permissionId: string) => {
      if (!userAccountPermissions.value[contractAccountId]) return false;
      
      return userAccountPermissions.value[contractAccountId].includes(permissionId);
    };

    // Check if a permission is available (exists in the contract account)
    const isPermissionAvailable = (contractAccountId: string, permissionId: string) => {
      const contractAccount = contractAccountsData.value
        .flatMap(customer => customer.contractAccounts)
        .find(acc => acc.id === contractAccountId);
        
      if (!contractAccount || !contractAccount.permissions) return false;
      
      return contractAccount.permissions.some(p => p.code === permissionId);
    };

    // Get available permissions for a contract account
    const getAvailablePermissions = (contractAccountId: string) => {
      const contractAccount = contractAccountsData.value
        .flatMap(customer => customer.contractAccounts)
        .find(acc => acc.id === contractAccountId);
        
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
        
        // Structure the payload to include both account IDs and permissions
        const accountsWithPermissions = selectedAccounts.value.map(account => {
          const permissionId = getPermissionId(account);
          
          return {
            contractAccountId: account.contractAccountId,
            userAccountId: account.userAccountId, // Include if exists
            permissionIds: userAccountPermissions.value[permissionId] || []
          };
        });
        
        const newValues = {
          contractAccounts: accountsWithPermissions
        };

        console.log("newValues: ", newValues);
        // Make your API call here to add the accounts with permissions
        // const response = await addUserAccounts(props.contractUserId || '', newValues);
        
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
      if (!customer || !customer.contractAccounts) return;
      
      // Check if all accounts of this customer are already selected
      const allSelected = customer.contractAccounts.every((contractAccount: ContractAccount) => 
        isAccountSelected(contractAccount)
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
              accountId: contractAccount.account?.id || '',
              contractAccountId: contractAccount.id
            });
          }
        });
      }
      
      console.log("Selected accounts after bulk action:", selectedAccounts.value);
    };

    const getCustomerSelectionState = (customer: any) => {
      if (!customer || !customer.contractAccounts || customer.contractAccounts.length === 0) return false;
      
      const selectedCount = customer.contractAccounts.filter((contractAccount: ContractAccount) => 
        isAccountSelected(contractAccount)
      ).length;
      
      if (selectedCount === 0) return false;
      if (selectedCount === customer.contractAccounts.length) return true;
      return 'indeterminate'; // For partially selected state
    };

    // Get the selected contract account object by ID
    const getSelectedContractAccount = (contractAccountId: string) => {
      return contractAccountsData.value
        .flatMap(customer => customer.contractAccounts)
        .find(acc => acc.id === contractAccountId);
    };

    const permissionsDialogOpen = ref(false);
    const currentEditingAccount = ref<{ 
      contractAccount: ContractAccount | null, 
      permissionId: string 
    }>({ contractAccount: null, permissionId: '' });

    // Open the permissions dialog for a specific account
    const openPermissionsDialog = (selectedAccount: { contractAccountId: string, userAccountId?: string }) => {
      const contractAccount = getSelectedContractAccount(selectedAccount.contractAccountId);
      if (!contractAccount) {
        console.error("Could not find contract account:", selectedAccount.contractAccountId);
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
        permissionId
      };
      
      console.log("Opening dialog for:", permissionId);
      console.log("Available permissions:", getAvailablePermissions(contractAccount.id || ''));
      console.log("Selected permissions:", getSelectedPermissions(permissionId));
      
      // Delay opening the dialog slightly to ensure data is ready
      setTimeout(() => {
        permissionsDialogOpen.value = true;
      }, 50);
    };

    // Update permissions from dialog
    const savePermissions = (data: { id?: string, permissions: string[] }) => {
      if (!data.id) return;
      
      console.log("Received permissions to save:", data);
      
      // Make sure userAccountPermissions is initialized for this ID
      if (!userAccountPermissions.value[data.id]) {
        userAccountPermissions.value[data.id] = [];
      }
      
      // Replace the permissions for this ID with the new permissions
      userAccountPermissions.value[data.id] = [...data.permissions];
      
      console.log("Updated permissions for", data.id, ":", userAccountPermissions.value[data.id]);
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
                        <p class="font-medium text-sm">{{ customer.contractAccounts.length }}</p>
                      </div>
                    </UiAccordionTrigger>
                    </div>
                  
                  </div>
                </div>

                <UiAccordionContent class="px-4 pb-4">
                  <div v-for="contractAccount in customer.contractAccounts" :key="contractAccount.id" 
                       class="grid grid-cols-2 md:grid-cols-3 gap-6 w-full px-6 py-4 border-t">
                    <div class="flex items-center w-full">
                      <UiCheckbox
                        :checked="isAccountSelected(contractAccount)"
                        @click="handleAccountSelect(contractAccount)"
                        class="h-5 w-5 mr-8"
                      />
                      <div>
                        <p class="text-sm text-muted-foreground">Contract Account ID</p>
                        <p class="font-medium">{{ contractAccount.id }}</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Account Number</p>
                      <p class="font-medium">{{ contractAccount.account?.accountNumber }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Account Holder</p>
                      <p class="font-medium">{{ displayApiDataOnLabel(contractAccount.account?.accountHolder) }}</p>
                    </div>
                  </div>
                </UiAccordionContent>
              </UiAccordionItem>
            </template>

            <!-- Special section for selected accounts with permissions dialog buttons -->
            <UiAccordionItem
              value="selected-accounts"
              class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
            >
              <div class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors">
                <div class="flex items-center gap-4 w-full">
                  <div class="flex-1 py-2">
                    <h3 class="font-medium">Selected Accounts ({{ selectedAccounts.length }})</h3>
                  </div>
                  <UiAccordionTrigger />
                </div>
              </div>

              <UiAccordionContent class="px-4 pb-4">
                <div v-if="selectedAccounts.length === 0" class="text-center py-4 text-muted-foreground">
                  No accounts selected yet
                </div>
                
                <div v-for="(selectedAccount, index) in selectedAccounts" :key="selectedAccount.contractAccountId" 
                     class="border rounded-lg mb-4 overflow-hidden">
                  <!-- Account details header -->
                  <div class="bg-muted/30 px-6 py-3 flex justify-between items-center">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <p class="text-sm text-muted-foreground">Contract Account ID</p>
                        <p class="font-medium">{{ selectedAccount.contractAccountId }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Account Number</p>
                        <p class="font-medium">{{ getSelectedContractAccount(selectedAccount.contractAccountId)?.account?.accountNumber }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-muted-foreground">Account Holder</p>
                        <p class="font-medium">{{ displayApiDataOnLabel(getSelectedContractAccount(selectedAccount.contractAccountId)?.account?.accountHolder) }}</p>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <!-- Permissions button -->
                      <UiButton 
                        variant="outline" 
                        size="sm" 
                        @click="openPermissionsDialog(selectedAccount)"
                      >
                        <Icon name="lucide:shield" class="h-4 w-4 mr-2" />
                        Permissions
                        <span v-if="getSelectedPermissions(getPermissionId(selectedAccount)).length > 0" class="ml-2 bg-primary text-primary-foreground rounded-full text-xs px-2">
                          {{ getSelectedPermissions(getPermissionId(selectedAccount)).length }}
                        </span>
                      </UiButton>
                      
                      <!-- Remove button -->
                      <UiButton 
                        variant="ghost" 
                        size="icon" 
                        @click="handleAccountSelect(getSelectedContractAccount(selectedAccount.contractAccountId) as ContractAccount)"
                      >
                        <Icon name="lucide:x" class="h-4 w-4" />
                      </UiButton>
                    </div>
                  </div>
                </div>
              </UiAccordionContent>
            </UiAccordionItem>
          </UiAccordion>
          <!-- </div> -->
          <div class="flex justify-between items-center">
          <p class="text-sm text-muted-foreground">
              {{ selectedAccounts.length }} selected
            </p>
          <UiButton @click="addAccounts"  type="submit" class="w-fit self-end px-8">
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

      <!-- Add the permissions dialog component with updated props -->
      <PermissionsDialog
        v-if="currentEditingAccount.contractAccount"
        v-model:open="permissionsDialogOpen"
        :contract-account="currentEditingAccount.contractAccount"
        :permission-id="currentEditingAccount.permissionId"
        :selected-permissions="getSelectedPermissions(currentEditingAccount.permissionId)"
        :available-permissions="getAvailablePermissions(currentEditingAccount.contractAccount.id || '')"
        :is-user-account="!!selectedAccounts.find(acc => acc.userAccountId === currentEditingAccount.permissionId)"
        @save-permissions="savePermissions"
      />
    </template>

    <style lang="css" scoped></style>
