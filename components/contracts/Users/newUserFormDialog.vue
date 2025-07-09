<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "~/components/ui/toast";
import { newContractUserFormSchema } from "~/validations/newContractUserFormSchema";
import { getIdFromPath } from "~/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import UserPermissions from './userPermissions.vue';

const { getContractCoreCustomers } = useContractsCoreCustomers();
const { getCoreAccountsByAccount } = useCustomers();
const { getServiceDefinitionRolesByServiceDefinitionId } = useServiceDefinitionsRoles();
const { createNewContractForNewUser } = useContractsUsers();

const props = defineProps<{ serviceDefinitionId?: string }>();
const contractId = ref<string>(getIdFromPath());
const contractAccounts = ref<any[]>([]); // All contract accounts
const selectedAccounts = ref<any[]>([]); // Selected contract accounts with permission info
const serviceDefinitionsRolesData = ref<any[]>([]);
const isSubmitting = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const coreAccountNumber = ref<string>("");
const phone = ref<string>("");
const name = ref<string>("");
const accountSearchNumber = ref<string>("");
const showAlreadyHasContract = ref(false);
const route  = useRouter()

const emit = defineEmits(["close"]);


const form = useForm({
  validationSchema: newContractUserFormSchema,
  initialValues: {
    phone: "",
    nationalId: "",
    language: null,
    isPrimaryUser: false,
  },
});

const fetchServiceDefinitionRoles = async () => {
  if (!props.serviceDefinitionId) return;
  try {
    const roles = await getServiceDefinitionRolesByServiceDefinitionId(props.serviceDefinitionId);
    serviceDefinitionsRolesData.value = roles || [];
  } catch (err: any) {
    serviceDefinitionsRolesData.value = [];
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getContractCoreCustomers(contractId.value);
    contractAccounts.value = (response || []).flatMap((customer: any) =>
      (customer.coreAccounts || []).map((acc: any) => ({
        ...acc,
        permissions: acc.permissions || [],
        inheritAccountPermissions: true,
        permissionCodes: [],
        selected: false,
      }))
    );
    await fetchServiceDefinitionRoles();
  } catch (err: any) {
    errorMessage.value = err.message || "Failed to fetch contract accounts.";
  } finally {
    loading.value = false;
  }
});

// Refetch roles if serviceDefinitionId changes
watch(() => props.serviceDefinitionId, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    await fetchServiceDefinitionRoles();
  }
});

// Account number search and populate phone/name
const searchAccount = async () => {
  if (!accountSearchNumber.value) return;
  loading.value = true;
  showAlreadyHasContract.value = false;
  try {
    // Ensure accountSearchNumber.value is a number
    const response = await getCoreAccountsByAccount(Number(accountSearchNumber.value));
    if (response) {
      phone.value = response.phone || "";
      name.value = response.fullName || "";
      form.setFieldValue("phone", phone.value);
      form.setFieldValue("name", name.value);
      form.setFieldValue("coreAccountNumber", accountSearchNumber.value);
      // Use the searched value for coreAccountNumber
      coreAccountNumber.value = accountSearchNumber.value;
      if (response.contractId) {
        showAlreadyHasContract.value = true;
      }
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Account not found.";
    toast({
      title: "Account not found",
      description: errorMessage.value,
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

// Handle selecting/deselecting contract accounts
const toggleAccountSelection = (account: any) => {
  account.selected = !account.selected;
  if (account.selected) {
    // Add to selectedAccounts with default inheritAccountPermissions true
    selectedAccounts.value.push({
      accountId: account.id,
      inheritAccountPermissions: true,
      permissionCodes: [],
      permissions: account.permissions || [],
    });
  } else {
    // Remove from selectedAccounts
    const idx = selectedAccounts.value.findIndex((a) => a.accountId === account.id);
    if (idx !== -1) selectedAccounts.value.splice(idx, 1);
  }
};

// Handle inheritAccountPermissions toggle for a selected account
const toggleInheritPermissions = (accountId: string, value: boolean) => {
  const acc = selectedAccounts.value.find((a) => a.accountId === accountId);
  const account = contractAccounts.value.find((a) => a.id === accountId);
  if (acc) {
    acc.inheritAccountPermissions = value;
    if (value) {
      acc.permissionCodes = [];
    } else if (account && Array.isArray(account.permissions)) {
      // Select all permissions from that contractAccount
      acc.permissionCodes = account.permissions.map((perm: any) => perm.code);
    }
  }
};

// Select All logic
const allAccountsSelected = computed(() =>
  contractAccounts.value.length > 0 && contractAccounts.value.every(acc => acc.selected)
);
const someAccountsSelected = computed(() =>
  contractAccounts.value.some(acc => acc.selected) && !allAccountsSelected.value
);
const toggleSelectAllAccounts = () => {
  if (allAccountsSelected.value) {
    // Deselect all
    contractAccounts.value.forEach(acc => acc.selected = false);
    selectedAccounts.value = [];
  } else {
    // Select all
    contractAccounts.value.forEach(acc => {
      if (!acc.selected) {
        acc.selected = true;
        // Add to selectedAccounts if not already present
        if (!selectedAccounts.value.find(a => a.accountId === acc.id)) {
          selectedAccounts.value.push({
            accountId: acc.id,
            inheritAccountPermissions: true,
            permissionCodes: [],
            permissions: acc.permissions || [],
          });
        }
      }
    });
  }
};

// Watch for form submission and show errors if invalid
const onSubmit = async (e: Event) => {
  e.preventDefault();
  const valid = await form.validate();
  if (!coreAccountNumber.value) {
    toast({
      title: "Account number required",
      description: "Please search and select a valid account number.",
      variant: "destructive",
    });
    return;
  }
  if (!valid.valid) {
    return;
  }

  if (selectedAccounts.value.length === 0) {
    toast({
      title: "No contract accounts selected",
      description: "Please select at least one contract account.",
      variant: "destructive",
    });
    return;
  }
  isSubmitting.value = true;
  try {
    const values = form.values;
    const body = {
      phone: phone.value,
      nationalId: values.nationalId,
      language: values.language,
      isPrimaryUser: values.isPrimaryUser,
      serviceDefinitionRoleId: values.serviceDefinitionRoleId,
      coreAccountNumber: coreAccountNumber.value,
      contractUserAccountDTOSet: selectedAccounts.value.map((acc) => ({
        inheritAccountPermissions: acc.inheritAccountPermissions,
        permissionCodes: acc.inheritAccountPermissions ? [] : acc.permissionCodes,
        accountId: acc.accountId,
      })),
    };
    await createNewContractForNewUser(contractId.value, body);
    toast({
      title: "User Created",
      description: "Contract user created successfully.",
    });
    emit("close")
    route.push(`/contracts/${contractId.value}?activeTab=contractUsers`)
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message || "Failed to create contract user.",
      variant: "destructive",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8 overflow-y-scroll">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">Create new customer and add to contract user</h1>
      <p class="text-sm text-muted-foreground">
        Create a new customer user by searching for an account, selecting contract accounts, and assigning permissions.
      </p>
    </div>
    <UiCard class="w-full flex border-[1px] rounded-lg ">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit" class="space-y-6">
          <div class="flex items-center gap-4 md:w-1/2 pr-3">
                <UiInput
                  v-model="accountSearchNumber"
                  type="text"
                  placeholder="Enter account number"
                  class="w-full"
                  :disabled="loading"
                />
                <UiButton :disabled="loading || !accountSearchNumber" @click.prevent="searchAccount">
                  <Icon name="svg-spinners:8-dots-rotate" v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
                  Search
                </UiButton>
              </div>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-4">
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <UiInput type="text" placeholder="Enter fullname" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <UiInput type="text" placeholder="Enter phone" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="coreAccountNumber">
                <FormItem>
                  <FormLabel>Core Account Number</FormLabel>
                  <FormControl>
                    <UiInput type="text" placeholder="Enter core account number" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div v-if="showAlreadyHasContract" class="text-red-500 text-xs font-semibold">
                This account already has a contract.
              </div>
            </div>
            <div class="flex flex-col gap-4">
                            <FormField v-slot="{ componentField, errorMessage }" name="serviceDefinitionRoleId">
                <FormItem>
                  <FormLabel>Service Definition Role</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service definition role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in serviceDefinitionsRolesData" :key="item.id" :value="item.id">
                          {{ item.roleName }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage>{{ errorMessage }}</FormMessage>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="nationalId">
                <FormItem>
                  <FormLabel>National ID</FormLabel>
                  <FormControl>
                    <UiInput type="text" placeholder="Enter national ID" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="language">
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <UiInput type="text" placeholder="Enter language" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ value, handleChange }" name="isPrimaryUser">
                <FormItem class="flex flex-row items-center gap-4">
                  <FormLabel>Is Primary User</FormLabel>
                  <FormControl>
                    <UiSwitch :checked="value" @update:checked="handleChange" />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>
          </div>
          <div class="mt-8">
            <h2 class="text-lg font-semibold mb-2">Select Contract Accounts</h2>
            <div class="flex items-center mb-4">
              <UiCheckbox
                :checked="allAccountsSelected"
                :indeterminate="someAccountsSelected"
                @click="toggleSelectAllAccounts"
              />
              <span class="ml-2 text-sm">Select All Accounts</span>
            </div>
            <!-- <div v-if="loading" class="text-center py-4">
              
            </div> -->

            <div v-if="loading" class="py-10 flex justify-center w-full">
              <UiLoading />
            </div>
            <div v-else-if="contractAccounts.length === 0" class="text-center py-4 text-muted-foreground">
              No contract accounts found.
            </div>
            <div v-else class="flex flex-col gap-4">
              <div v-for="account in contractAccounts" :key="account.id" class="border rounded-lg p-4 flex flex-row gap-6 items-center bg-white shadow-sm">
                <UiCheckbox :checked="account.selected" @click="toggleAccountSelection(account)" class="mr-4" />
                <div class="flex flex-row flex-wrap gap-8 w-full items-center">
                  <div class="flex flex-col min-w-[180px]">
                    <span class="text-xs text-muted-foreground">Account Number</span>
                    <span class="font-medium text-base">{{ account.accountNumber }}</span>
                  </div>
                  <div class="flex flex-col min-w-[180px]">
                    <span class="text-xs text-muted-foreground">Account Holder</span>
                    <span class="font-medium text-base">{{ account.accountHolder }}</span>
                  </div>
                  <div class="flex flex-col min-w-[180px]">
                    <span class="text-xs text-muted-foreground">Account Category</span>
                    <span class="font-medium text-base">{{ account.accountCategory?.description }}</span>
                  </div>
                  <div v-if="account.selected" class="flex flex-col min-w-[220px]">
                    <span class="text-xs text-muted-foreground mb-1">Inherit Contract Customer Permissions</span>
                    <UiSwitch :checked="selectedAccounts.find(a => a.accountId === account.id)?.inheritAccountPermissions" @update:checked="val => toggleInheritPermissions(account.id, val)" />
                  </div>
                  <div v-if="account.selected && !selectedAccounts.find(a => a.accountId === account.id)?.inheritAccountPermissions" class="flex flex-col min-w-[260px]">
                    <span class="text-xs text-muted-foreground mb-1">Select userAccount Permissions</span>
                    <div v-if="account.permissions && account.permissions.length > 0" class="mt-1">
                      <UserPermissions
                        :permissions="account.permissions"
                        :selected="selectedAccounts.find(a => a.accountId === account.id)?.permissionCodes || []"
                        @update:modelValue="(val) => {
                          const acc = selectedAccounts.find(a => a.accountId === account.id);
                          if (acc) acc.permissionCodes = val;
                        }"
                      />
                    </div>
                    <div v-else class="text-xs text-muted-foreground italic mt-2">No permissions available for this account.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-full w-full py-4 flex justify-end items-center gap-6">
            <UiButton variant="outline" type="button" :disabled="isSubmitting" @click="emit('close')">
              Submit
            </UiButton>
            <UiButton :disabled="isSubmitting" type="submit">
              <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Submit
            </UiButton>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>
