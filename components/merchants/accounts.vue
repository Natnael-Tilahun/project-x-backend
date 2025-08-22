<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath } from "~/lib/utils";

const { getCoreAccountsByCustomerId } = useCustomers();
const { addMerchantAccounts, deleteMerchantAccounts } = useMerchants();

const merchantId = ref(getIdFromPath());
const coreCustomerId = ref<string>("");

// Props
const props = defineProps<{
  selectedAccounts?: string[] | null; // array of accountNumbers
  coreCustomerIdProps?: string | null;
}>();

const emit = defineEmits(["refetch"]);


// Data
const accountsData = ref<any[]>([]);
const selectedAccounts = ref<string[]>(props.selectedAccounts || []);
const loading = ref(false);
const isError = ref(false);

// For UI selection
const selectedAccountsToAdd = ref<string[]>([]);
const selectedAccountsToDelete = ref<string[]>([]);
const addAccountLoading = ref(false);
const deleteAccountLoading = ref(false);

// Fetch all merchant accounts
const fetchMerchantAccountsData = async (coreCustomerId: string) => {
  try {
    loading.value = true;
    isError.value = false;
    if (coreCustomerId) {
      const result = await getCoreAccountsByCustomerId(coreCustomerId);
      console.log("result: ", result)
      accountsData.value = result ? [...result] : [];
    }
  } catch (err) {
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// Watch for prop changes
watch(
  () => props.selectedAccounts,
  (val) => {
    selectedAccounts.value = val || [];
  }
);
watch(
  () => props.coreCustomerIdProps,
  (val) => {
    if (val) {
      coreCustomerId.value = val;
      fetchMerchantAccountsData(val);
    }
  },
  { immediate: true }
);

// Add selected accounts
const addSelectedAccounts = async () => {
  if (!selectedAccountsToAdd.value.length) return;
  try {
    addAccountLoading.value = true;
    await addMerchantAccounts(merchantId.value, {
      accountNumbers: selectedAccountsToAdd.value,
    });
    toast({
      title: "Accounts Added",
      description: "Selected accounts have been added.",
    });
    selectedAccounts.value.push(...selectedAccountsToAdd.value);
    selectedAccountsToAdd.value = [];
    emit("refetch");
  } catch (err) {
    isError.value = true;
  } finally {
    addAccountLoading.value = false;
  }
};

// Delete selected accounts
const deleteSelectedAccounts = async () => {
  if (!selectedAccountsToDelete.value.length) return;
  try {
    deleteAccountLoading.value = true;
    await deleteMerchantAccounts(merchantId.value, {
      accountNumbers: selectedAccountsToDelete.value,
    });
    toast({
      title: "Accounts Deleted",
      description: "Selected accounts have been removed.",
    });
    selectedAccounts.value = selectedAccounts.value.filter(
      (id) => !selectedAccountsToDelete.value.includes(id)
    );
    selectedAccountsToDelete.value = [];
    emit("refetch");
  } catch (err) {
    isError.value = true;
  } finally {
    deleteAccountLoading.value = false;
  }
};

// Select/unselect helpers for accounts
const selectAllAvailableAccounts = () => {
  selectedAccountsToAdd.value = accountsData.value
    .filter((a) => !selectedAccounts.value.includes(a.accountNumber))
    .map((a) => a.accountNumber);
};
const unselectAllAvailableAccounts = () => {
  selectedAccountsToAdd.value = [];
};
const selectAllAssignedAccounts = () => {
  selectedAccountsToDelete.value = [...selectedAccounts.value];
};
const unselectAllAssignedAccounts = () => {
  selectedAccountsToDelete.value = [];
};

// Initial fetch
onMounted(() => {
  if (props.coreCustomerIdProps) {
    coreCustomerId.value = props.coreCustomerIdProps;
    fetchMerchantAccountsData(coreCustomerId.value);
  }
});
</script>

<template>
  <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Merchant Accounts</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <UiCard class="flex flex-col gap-6 items-center p-6 h-full">
          <div v-if="loading" class="py-10 flex justify-center w-full">
            <UiLoading />
          </div>
          <div
            v-else-if="accountsData.length > 0 && !isError"
            class="w-full h-full"
            style="min-height: 400px;"
          >
            <div class="flex gap-8 h-full w-full">
              <!-- Left: Available Accounts -->
              <div class="w-full h-full flex flex-col">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium">Available Accounts</p>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedAccountsToAdd.length }} of
                    {{
                      accountsData.filter(
                        a => !selectedAccounts.includes(a.accountNumber)
                      ).length
                    }}
                    accounts
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="selectAllAvailableAccounts"
                    :disabled="!accountsData.filter(a => !selectedAccounts.includes(a.accountNumber)).length"
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="unselectAllAvailableAccounts"
                    :disabled="!selectedAccountsToAdd.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiButton
                    class="ml-auto w-fit bg-green-600"
                    :disabled="selectedAccountsToAdd.length === 0 || addAccountLoading"
                    @click="addSelectedAccounts"
                  >
                    <Icon
                      name="material-symbols:add"
                      v-if="addAccountLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    <Icon
                      name="heroicons:plus-circle"
                      v-if="!addAccountLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    Add
                    {{ selectedAccountsToAdd.length ? `(${selectedAccountsToAdd.length})` : '' }}
                  </UiButton>
                </div>
                <UiCard class="px-4 py-2 flex-1 gap-4 flex flex-col overflow-y-auto">
                  <FormField
                    v-for="account in accountsData"
                    :key="account.accountNumber"
                    :model-value="selectedAccountsToAdd.includes(account.accountNumber)"
                    name="availableAccounts"
                  >
                    <FormItem class="flex items-center gap-2">
                      <FormControl>
                        <UiCheckbox
                          :id="`available-account-checkbox-${account.accountNumber}`"
                          :checked="selectedAccountsToAdd.includes(account.accountNumber)"
                          :disabled="selectedAccounts.includes(account.accountNumber)"
                          @update:checked="checked => {
                            if (checked) {
                              selectedAccountsToAdd.push(account.accountNumber)
                            } else {
                              selectedAccountsToAdd = selectedAccountsToAdd.filter(accountNumber => accountNumber !== account.accountNumber)
                            }
                          }"
                        />
                      </FormControl>
                      <FormLabel
                        :for="`available-account-checkbox-${account.accountNumber}`"
                        :class="{
                          'text-gray-400': selectedAccounts.includes(account.accountNumber)
                        }"
                        @click.prevent="
                          !selectedAccounts.includes(account.accountNumber) &&
                          (
                            selectedAccountsToAdd.includes(account.accountNumber)
                              ? selectedAccountsToAdd = selectedAccountsToAdd.filter(accountNumber => accountNumber !== account.accountNumber)
                              : selectedAccountsToAdd.push(account.accountNumber)
                          )
                        "
                        style="cursor: pointer;"
                      >
                        {{ account.accountNumber }}
                        <span v-if="account.accountName">- {{ account.accountName }}</span>
                      </FormLabel>
                    </FormItem>
                  </FormField>
                </UiCard>
                <UiButton
                  class="mt-4 w-full bg-green-600"
                  :disabled="selectedAccountsToAdd.length === 0 || addAccountLoading"
                  @click="addSelectedAccounts"
                >
                  <Icon
                    name="material-symbols:add"
                    v-if="addAccountLoading"
                    class="mr-2 h-4 w-4 animate-spin"
                  ></Icon>
                  <Icon
                    name="heroicons:plus-circle"
                    v-if="!addAccountLoading"
                    class="mr-2 h-4 w-4"
                  ></Icon>
                  Add
                  {{ selectedAccountsToAdd.length ? `(${selectedAccountsToAdd.length})` : '' }}
                </UiButton>
              </div>

              <!-- Middle: Bi-directional Arrow -->
              <div class="flex flex-col items-center justify-center gap-2 w-1/2 h-full self-center">
                <Icon name="heroicons:arrow-right" :class="selectedAccountsToAdd.length != 0 && 'text-primary'" class="h-10 w-10 text-gray-400" />
                <Icon name="heroicons:arrow-left" :class="selectedAccountsToDelete.length != 0 && 'text-primary'" class="h-10 w-10 text-gray-400" />
              </div>

              <!-- Right: Assigned Accounts -->
              <div class="w-full min-h-min flex flex-col">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium">Assigned Accounts</p>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedAccountsToDelete.length }} of {{ selectedAccounts.length }} selected
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="selectAllAssignedAccounts"
                    :disabled="!selectedAccounts.length"
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="unselectAllAssignedAccounts"
                    :disabled="!selectedAccountsToDelete.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiButton
                    size="sm"
                    class="w-fit ml-auto bg-red-600 text-white"
                    :disabled="selectedAccountsToDelete.length === 0 || deleteAccountLoading"
                    @click="deleteSelectedAccounts"
                  >
                    <Icon
                      name="heroicons:trash"
                      v-if="!deleteAccountLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="deleteAccountLoading"
                      :disabled="deleteAccountLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Delete
                    {{ selectedAccountsToDelete.length ? `(${selectedAccountsToDelete.length})` : '' }}
                  </UiButton>
                </div>
                <UiCard class="px-4 py-2 flex-1 gap-4 flex flex-col overflow-y-auto ">
                  <template v-if="selectedAccounts.length > 0">
                    <FormField
                      v-for="account in accountsData.filter(a => selectedAccounts.includes(a.accountNumber))"
                      :key="account.accountNumber"
                      :model-value="selectedAccountsToDelete.includes(account.accountNumber)"
                      name="assignedAccounts"
                    >
                      <FormItem class="flex items-center gap-2">
                        <FormControl>
                          <UiCheckbox
                            :id="`assigned-account-checkbox-${account.accountNumber}`"
                            :checked="selectedAccountsToDelete.includes(account.accountNumber)"
                            @update:checked="checked => {
                              if (checked) {
                                selectedAccountsToDelete.push(account.accountNumber)
                              } else {
                                selectedAccountsToDelete = selectedAccountsToDelete.filter(accountNumber => accountNumber !== account.accountNumber)
                              }
                            }"
                          />
                        </FormControl>
                        <FormLabel
                          :for="`assigned-account-checkbox-${account.accountNumber}`"
                          @click.prevent="
                            selectedAccountsToDelete.includes(account.accountNumber)
                              ? selectedAccountsToDelete = selectedAccountsToDelete.filter(accountNumber => accountNumber !== account.accountNumber)
                              : selectedAccountsToDelete.push(account.accountNumber)
                          "
                          style="cursor: pointer;"
                        >
                          {{ account.accountNumber }}
                          <span v-if="account.accountName">- {{ account.accountName }}</span>
                        </FormLabel>
                      </FormItem>
                    </FormField>
                  </template>
                  <template v-else>
                    <div class="text-center text-gray-400 py-8">
                      No assigned accounts to remove.
                    </div>
                  </template>
                </UiCard>
                <UiButton
                  class="mt-4 w-full bg-red-600 text-white"
                  :disabled="selectedAccountsToDelete.length === 0 || deleteAccountLoading"
                  @click="deleteSelectedAccounts"
                >
                  <Icon
                    name="heroicons:trash"
                    v-if="!deleteAccountLoading"
                    class="mr-2 h-4 w-4"
                  ></Icon>
                  <Icon
                    name="svg-spinners:8-dots-rotate"
                    v-if="deleteAccountLoading"
                    :disabled="deleteAccountLoading"
                    class="mr-2 h-4 w-4 animate-spin"
                  ></Icon>
                  Delete
                  {{ selectedAccountsToDelete.length ? `(${selectedAccountsToDelete.length})` : '' }}
                </UiButton>
              </div>
            </div>
          </div>
          <div class="w-full p-6" v-else-if="accountsData.length == 0 && !isError">
            <UiNoResultFound title="Sorry, No accounts found." />
          </div>
          <div v-if="isError" class="w-full">
            <ErrorMessage title="Something went wrong." :retry="() => fetchMerchantAccountsData(coreCustomerId)" />
          </div>
        </UiCard>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>
