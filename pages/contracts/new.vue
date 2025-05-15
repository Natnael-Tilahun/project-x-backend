<script lang="ts" setup>
const openItems = ref(["item-1"]);
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref, onBeforeUnmount } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractFormSchema } from "~/validations/newContractFormSchema";
import { ServiceType } from "@/global-types";
import type {
  Account,
  Contract,
  ContractAccount,
  Permission,
  ServiceDefinition,
} from "~/types";
const { createNewContract, isLoading } = useContracts();
const { getServiceDefinitions, getServiceDefinitionById } =
  useServiceDefinitions();
const { getPermissions } = usePermissions();
const { getCoreAccountsByCustomerId, isLoading: isLoadingAccounts } =
  useCustomers();
const {
  getContractCoreCustomerAccounts,
  updateContractCoreCustomerAccountStatus,
  isLoading: isLoadingContractCoreCustomerAccount,
} = useContractsCoreCustomersAccount();

const isError = ref(false);
const data = ref<Contract>();
const isSubmitting = ref(false);
const permissionsData = ref<Permission[]>([]);
const serviceDefinitionPermissionsData = ref<Permission[]>([]);
const serviceDefinitionsData = ref<ServiceDefinition[]>([]);
const selectedPermissions = ref<Permission[]>([]);
const selectedCoreCustomerPermissions = ref<Permission[]>([]);
const selectedAccountPermissions = ref<Permission[]>([]);
const selectedAccounts = ref<Account[]>([]);
const coreCustomerId = ref<string>("");
const loading = ref(false);
const errorMessage = ref("");
const store = useAuthStore();
const accountsData = ref<any>();
const selectedContractAccount = ref<ContractAccount[]>([]);
const contractCoreCustomerId = ref<any>();

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

const form = useForm({
  validationSchema: newContractFormSchema,
  initialValues: {
    inheritParentServicePermissions: true,
    coreCustomers: [
      {
        coreCustomerId: "",
        inheritParentContractPermissions: true,
        permissionCodes: [],
        primaryCoreCustomer: true,
        coreAccounts: [
          {
            accountNumber: "",
            inheritContractCustomerPermissions: true,
            permissionCodes: [],
          },
        ],
      },
    ],
  },
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;

    // Format accounts into the correct structure for each core customer
    const coreAccounts = selectedAccounts.value.map((account) => ({
      accountNumber: account.accountNumber,
      inheritContractCustomerPermissions:
        form.values.coreCustomers?.[0]?.coreAccounts?.accountNumber
          ?.inheritContractCustomerPermissions ?? true,
      permissionCodes: !form.values.coreCustomers?.[0]?.coreAccounts?.accountNumber
      ?.inheritContractCustomerPermissions
        ? form.values.coreCustomers?.[0]?.coreAccounts?.accountNumber
            ?.permissionCodes || []
        : [],
    }));

    // Construct the contract according to type definition
    const newValues = {
      name: values.name,
      description: values.description,
      serviceType: values.serviceType,
      serviceDefinitionId: 
      values.serviceDefinitionId,
      permissionCodes: !values.inheritParentServicePermissions
        ? values.permissionCodes || []
        : [],
      inheritParentServicePermissions: values.inheritParentServicePermissions,
      coreCustomers: coreCustomerId.value
        ? [
            {
              coreCustomerId: coreCustomerId.value,
              inheritParentContractPermissions:
                values.coreCustomers?.[0]?.inheritParentContractPermissions ??
                true,
              permissionCodes: !values.coreCustomers?.[0]
                ?.inheritParentContractPermissions
                ? values.coreCustomers?.[0]?.permissionCodes || []
                : [],
              primaryCoreCustomer:
                values.coreCustomers?.[0]?.primaryCoreCustomer ?? false,
              coreAccounts: coreAccounts.length > 0 ? coreAccounts : null,
            },
          ]
        : null,
    };

    if (!newValues.coreCustomers) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select a core customer.",
        variant: "destructive",
      });
      return;
    }

    if (!newValues.coreCustomers?.[0]?.coreAccounts?.length) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Please select at least one account.",
        variant: "destructive",
      });
      return;
    }

    console.log("newValues: ", newValues);
    data.value = await createNewContract(newValues);
    navigateTo(`/contracts`);
    toast({
      title: "Contract Created",
      description: "Contract created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new contract:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

const fetchServiceDefinitionPermissions = async (newType: string) => {
  try {
    console.log(
      "form.values?.serviceDefinition: ",
      form.values?.serviceDefinition
    );
    if (newType) {
      const serviceDefinition = await getServiceDefinitionById(newType);
      serviceDefinitionPermissionsData.value =
        serviceDefinition?.permissions || [];
      console.log(
        "serviceDefinitionPermissionsData.value: ",
        serviceDefinitionPermissionsData.value
      );
    }
  } catch (err) {
    console.error("Error fetching service definition permissions:", err);
  }
};

const fetchData = async () => {
  try {
    const permissions = await getPermissions(0, 100000);
    permissionsData.value = permissions.sort((a: Permission, b: Permission) =>
      a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
    );
    const serviceDefinitions = await getServiceDefinitions();
    serviceDefinitionsData.value = serviceDefinitions;
  } catch (err) {
    console.error("Error fetching permissions:", err);
    isError.value = true;
  }
};

await useAsyncData("permissionsData", async () => {
  await fetchData();
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
  form.resetForm();
});

const searchCoreAccountsByCustomerIdHandler = async () => {
  try {
    loading.value = true;
    isError.value = false;
    accountsData.value = [];
    selectedAccounts.value = [];
    if (coreCustomerId.value) {
      const response = await getCoreAccountsByCustomerId(coreCustomerId.value);
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
    errorMessage.value =
      err.message == "404 NOT_FOUND" ? "Account not found." : err.message;
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

const fetchContractCoreCustomerAccounts = async () => {
  try {
    loading.value = true;
    if (coreCustomerId.value) {
      const response = await getContractCoreCustomerAccounts(0, 100000000);
      const contractAccount = response.filter(
        (item: any) => item.coreCustomer?.id === contractCoreCustomerId.value
      );
      selectedContractAccount.value = contractAccount;
      selectedAccounts.value =
        contractAccount.map((item: any) => item.account) || [];
      accountsData.value = accountsData.value?.filter(
        (acc: Account) =>
          !selectedAccounts.value.some(
            (selectedAcc) => selectedAcc.accountNumber === acc.accountNumber
          )
      );
    }
  } catch (err: any) {
    console.error("Error fetching contract core customers accounts:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const isAccountSelected = (account: Account | undefined) => {
  return selectedAccounts.value.some(
    (a) => a.accountNumber === account?.accountNumber
  );
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

onMounted(async () => {
  await fetchContractCoreCustomerAccounts();
});

// Watch for changes in payment operation type
watch(
  () => form.values.serviceDefinition,
  async (newType) => {
    console.log("newType: ", newType);
    // If the service definition has changed, clear the permissions
    if (newType) {
      const serviceDefinition = await fetchServiceDefinitionPermissions(
        newType
      );
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Contract</h1>
      <p class="text-sm text-muted-foreground">
        Create new contract by including name, service type, permissions, and
        service definition
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter contract name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="serviceDefinitionId">
              <FormItem>
                <FormLabel> Service Definition </FormLabel>
                <UiSelect
                  @update:value="fetchServiceDefinitionPermissions"
                  v-bind="componentField"
                >
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select a service definition"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in serviceDefinitionsData"
                        :value="item?.id || ''"
                      >
                        {{ item.name }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ value, handleChange }"
              name="inheritParentServicePermissions"
            >
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base">
                  Inherit Parent Contract Permissions
                </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.permissionCodes"
              v-slot="{ componentField, errorMessage }"
              name="permissionCodes"
              v-if="!form.values.inheritParentServicePermissions"
            >
              <FormItem>
                <FormLabel>Select Permissions</FormLabel>
                <UiPopover>
                  <UiPopoverTrigger asChild>
                    <FormControl>
                      <div
                        variant="outline"
                        role="combobox"
                        class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                        :class="{
                          'text-muted-foreground':
                            !data?.permissionCodes?.length,
                        }"
                      >
                        {{
                          selectedPermissions?.length
                            ? selectedPermissions
                                .map(
                                  (permission: Permission) => permission.code
                                )
                                .join(", ")
                            : "Select permissions"
                        }}
                        <Icon
                          name="material-symbols:unfold-more-rounded"
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </div>
                    </FormControl>
                  </UiPopoverTrigger>
                  <UiPopoverContent class="w-full self-start p-0">
                    <UiCommand>
                      <UiCommandInput placeholder="Search product menus..." />
                      <UiCommandList>
                        <UiCommandEmpty>
                          <div class="text-sm text-muted-foreground p-6">
                            <p>No permissions found.</p>
                            <p>
                              Please select a service definition. If you have
                              selected a service definition, please check your
                              permissions.
                            </p>
                          </div>
                        </UiCommandEmpty>
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="permission in serviceDefinitionPermissionsData"
                            :key="permission.code"
                            :value="permission.code"
                            @select="
                              () => {
                                const isSelected =
                                  selectedPermissions.some(
                                    (selected: Permission) => selected.code === permission.code
                                  );

                                if (isSelected) {
                                  selectedPermissions =
                                      selectedPermissions.filter(
                                      (selected: Permission) =>
                                        selected.code !== permission.code
                                    );
                                } else {
                                  selectedPermissions.push(permission);
                                }

                                form.setFieldValue(
                                  'permissionCodes',
                                  selectedPermissions.map(
                                    (permission: Permission) => permission.code
                                  )
                                );
                              }
                            "
                          >
                            {{ permission.code }}
                            <UiCheckbox
                              :checked="
                                selectedPermissions.some(
                                  (selected: Permission) => selected.code === permission.code
                                )
                              "
                              class="ml-auto"
                            />
                          </UiCommandItem>
                        </UiCommandGroup>
                      </UiCommandList>
                    </UiCommand>
                  </UiPopoverContent>
                </UiPopover>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <div
              class="flex flex-col space-y-8 col-span-full border p-4 rounded-lg"
            >
              <div class="flex gap-8 items-center">
                <div class="grid w-full max-w-sm items-center gap-2">
                  <UiLabel
                    for="search"
                    class="font-normal text-muted-foreground"
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

              <UiCard class="w-full flex flex-col border-none gap-2">
                <!-- <div class="p-6"> -->
                <div class="flex justify-between items-center">
                  <h2 class="text-lg font-semibold">
                    Add Core Customer Accounts
                  </h2>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedAccounts.length }} selected
                  </p>
                </div>
                <div
                  v-if="coreCustomerId"
                  class="grid md:grid-cols-2 w-full gap-x-8 gap-y-4 pb-6"
                >
                  <FormField
                    v-slot="{ value, handleChange }"
                    name="coreCustomers[0].inheritParentContractPermissions"
                  >
                    <FormItem
                      class="flex flex-row items-center justify-between rounded-lg border px-4 pb-2 pt-1 w-full"
                    >
                      <FormLabel class="text-base">
                        Inherit Parent Contract Permissions
                      </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="value"
                          @update:checked="handleChange"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ value, handleChange }"
                    name="coreCustomers[0].primaryCoreCustomer"
                  >
                    <FormItem
                      class="flex flex-row items-center justify-between rounded-lg border px-4 pb-2 pt-1 w-full"
                    >
                      <FormLabel class="text-base">
                        Primary Core Customer
                      </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="value"
                          @update:checked="handleChange"
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField, errorMessage }"
                    name="coreCustomers[0].permissionCodes"
                    v-if="
                      !form.values?.coreCustomers?.[0]
                        ?.inheritParentContractPermissions
                    "
                  >
                    <FormItem>
                      <FormLabel>Select Core Customer permissions</FormLabel>
                      <UiPopover>
                        <UiPopoverTrigger asChild>
                          <FormControl>
                            <div
                              variant="outline"
                              role="combobox"
                              class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                              :class="{
                                'text-muted-foreground':
                                  !form.values?.coreCustomers?.[0]
                                    ?.permissionCodes?.length,
                              }"
                            >
                              {{
                                selectedPermissions?.length
                                  ? selectedPermissions
                                      .map(
                                        (permission: Permission) =>
                                          permission.code
                                      )
                                      .join(", ")
                                  : "Select permissions"
                              }}
                              <Icon
                                name="material-symbols:unfold-more-rounded"
                                class="ml-2 h-4 w-4 shrink-0 opacity-50"
                              />
                            </div>
                          </FormControl>
                        </UiPopoverTrigger>
                        <UiPopoverContent class="w-full self-start p-0">
                          <UiCommand>
                            <UiCommandInput
                              placeholder="Search core customer permissions..."
                            />
                            <UiCommandList>
                              <UiCommandEmpty
                                >No permissions found.</UiCommandEmpty
                              >
                              <UiCommandGroup>
                                <UiCommandItem
                                  v-for="permission in selectedPermissions"
                                  :key="permission.code"
                                  :value="permission.code"
                                  @select="
                                    () => {
                                      const isSelected =
                                      selectedCoreCustomerPermissions.some(
                                          (selected: Permission) => selected.code === permission.code
                                        );

                                      if (isSelected) {
                                        selectedCoreCustomerPermissions =
                                            selectedPermissions.filter(
                                            (selected: Permission) =>
                                              selected.code !== permission.code
                                          );
                                      } else {
                                        selectedCoreCustomerPermissions.push(permission);
                                      }

                                      form.setFieldValue(
                                        'coreCustomers[0].permissionCodes',
                                        selectedCoreCustomerPermissions.map(
                                          (permission: Permission) => permission.code
                                        )
                                      );
                                    }
                                  "
                                >
                                  {{ permission.code }}
                                  <UiCheckbox
                                    :checked="
                                      selectedCoreCustomerPermissions.some(
                                        (selected: Permission) => selected.code === permission.code
                                      )
                                    "
                                    class="ml-auto"
                                  />
                                </UiCommandItem>
                              </UiCommandGroup>
                            </UiCommandList>
                          </UiCommand>
                        </UiPopoverContent>
                      </UiPopover>
                      <FormMessage>{{ errorMessage }}</FormMessage>
                    </FormItem>
                  </FormField>
                </div>

                <UiAccordion
                  v-if="
                    ((accountsData && accountsData.length > 0) ||
                      selectedContractAccount.length > 0) &&
                    !loading &&
                    !isError
                  "
                  type="single"
                  collapsible
                  v-model:value="openItems"
                >
                  <UiAccordionItem
                    v-for="(account, index) in accountsData"
                    :key="account?.accountNumber"
                    :value="`item-${index + 2}`"
                    class="border rounded-lg mb-4 px-2 data-[state=open]:bg-muted/50"
                  >
                    <div
                      class="flex items-center px-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div class="flex items-center gap-5 w-full">
                        <UiCheckbox
                          :checked="isAccountSelected(account)"
                          @click.stop="handleAccountSelect(account)"
                          class="h-5 w-5"
                          :disabled="
                            (isAccountSelected(account) &&
                              !store.permissions.includes(
                                'DELETE_CONTRACT_ACCOUNTS'
                              )) ||
                            (!isAccountSelected(account) &&
                              !store.permissions.includes(
                                'CREATE_CONTRACT_ACCOUNTS'
                              ))
                          "
                        />
                        <!-- <UiAccordionTrigger class="ml-auto hover:no-underline"> -->
                        <div
                          class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-5 py-2"
                        >
                          <div>
                            <p class="text-sm text-muted-foreground">
                              Account Number
                            </p>
                            <p class="font-medium text-sm">
                              {{ account?.accountNumber }}
                            </p>
                          </div>
                          <div>
                            <p class="text-sm text-muted-foreground">
                              Account Title
                            </p>
                            <p class="font-medium text-sm">
                              {{ account?.accountTitle1 }}
                            </p>
                          </div>

                          <div>
                            <p class="text-sm text-muted-foreground">
                              Opening Date
                            </p>
                            <p class="font-medium text-sm">
                              {{
                                new Date(
                                  account?.openingDate || ""
                                ).toLocaleDateString()
                              }}
                            </p>
                          </div>

                          <FormField
                            v-slot="{ value, handleChange }"
                            :name="`coreCustomers[0].coreAccounts[${account.accountNumber}].inheritContractCustomerPermissions`"
                          >
                            <FormItem>
                              <FormLabel
                                class="text-sm text-muted-foreground font-normal"
                              >
                                Inherit Contract Customer Permissions
                              </FormLabel>
                              <FormControl>
                                <UiSwitch
                                  :checked="value !== false"
                                  @update:checked="
                                    (val) => {
                                      handleChange(val);
                                      form.setFieldValue(
                                        `coreCustomers[0].coreAccounts[${account.accountNumber}].inheritContractCustomerPermissions`,
                                        val
                                      );
                                    }
                                  "
                                />
                              </FormControl>
                            </FormItem>
                          </FormField>
                          <FormField
                            :model-value="
                              data?.coreCustomers?.[0]?.coreAccounts?.[
                                account.accountNumber
                              ]?.permissionCodes
                            "
                            v-slot="{ componentField, errorMessage }"
                            :name="`coreCustomers[0].coreAccounts[${account.accountNumber}].permissionCodes`"
                            v-if="
                              !form.values?.coreCustomers?.[0]?.coreAccounts?.[
                                account.accountNumber
                              ]?.inheritContractCustomerPermissions
                            "
                          >
                            <FormItem>
                              <FormLabel
                                class="text-sm text-muted-foreground font-normal"
                                >Select Account Permissions</FormLabel
                              >
                              <UiPopover>
                                <UiPopoverTrigger asChild>
                                  <FormControl>
                                    <div
                                      variant="outline"
                                      role="combobox"
                                      class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                                      :class="{
                                        'text-muted-foreground':
                                          !form.values?.coreCustomers?.[0]
                                            ?.coreAccounts?.[
                                            account.accountNumber
                                          ]?.permissionCodes?.length,
                                      }"
                                    >
                                      {{
                                        selectedAccountPermissions?.length
                                          ? selectedAccountPermissions
                                              .map(
                                                (permission: Permission) =>
                                                  permission.code
                                              )
                                              .join(", ")
                                          : "Select permissions"
                                      }}
                                      <Icon
                                        name="material-symbols:unfold-more-rounded"
                                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                                      />
                                    </div>
                                  </FormControl>
                                </UiPopoverTrigger>
                                <UiPopoverContent class="w-full self-start p-0">
                                  <UiCommand>
                                    <UiCommandInput
                                      placeholder="Search account permissions..."
                                    />
                                    <UiCommandList>
                                      <UiCommandEmpty
                                        >No permissions found.</UiCommandEmpty
                                      >
                                      <UiCommandGroup>
                                        <UiCommandItem
                                          v-for="permission in selectedCoreCustomerPermissions"
                                          :key="permission.code"
                                          :value="permission.code"
                                          @select="
                                            () => {
                                              const isSelected =
                                                selectedAccountPermissions.some(
                                                  (selected: Permission) => selected.code === permission.code
                                                );

                                              if (isSelected) {
                                                selectedAccountPermissions =
                                                    selectedAccountPermissions.filter(
                                                    (selected: Permission) =>
                                                      selected.code !== permission.code
                                                  );
                                              } else {
                                                selectedAccountPermissions.push(permission);
                                              }

                                              form.setFieldValue(
                                                `coreCustomers[0].coreAccounts[${account.accountNumber}].permissionCodes`,
                                                selectedAccountPermissions.map(
                                                  (permission: Permission) => permission.code
                                                )
                                              );
                                            }
                                          "
                                        >
                                          {{ permission.code }}
                                          <UiCheckbox
                                            :checked="
                                              selectedAccountPermissions.some(
                                                (selected: Permission) => selected.code === permission.code
                                              )
                                            "
                                            class="ml-auto"
                                          />
                                        </UiCommandItem>
                                      </UiCommandGroup>
                                    </UiCommandList>
                                  </UiCommand>
                                </UiPopoverContent>
                              </UiPopover>
                              <FormMessage>{{ errorMessage }}</FormMessage>
                            </FormItem>
                          </FormField>
                        </div>
                        <UiAccordionTrigger />
                      </div>
                    </div>

                    <UiAccordionContent class="px-4 pb-4">
                      <div
                        class="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-4 border-t"
                      >
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Customer ID
                          </p>
                          <p class="font-medium">{{ account.customerId }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Account Category
                          </p>
                          <p class="font-medium">
                            {{ account.accountCategoryId }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Joint Holder 1
                          </p>
                          <p class="font-medium">
                            {{
                              displayApiDataOnLabel(account.jointAccountHolder1)
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Joint Holder 2
                          </p>
                          <p class="font-medium">
                            {{
                              displayApiDataOnLabel(account.jointAccountHolder2)
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Cleared Balance
                          </p>
                          <p class="font-medium">
                            {{ account.onlineClearedBalance }}
                            {{ account.currency }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Last Updated
                          </p>
                          <p class="font-medium">
                            {{
                              new Date(
                                account.dateLastUpdate
                              ).toLocaleDateString()
                            }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Account Type
                          </p>
                          <p class="font-medium">
                            {{ displayApiDataOnLabel(account.accountType) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Inactive Marker
                          </p>
                          <p class="font-medium">
                            {{ displayApiDataOnLabel(account.inactivMarker) }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-muted-foreground">
                            Posting Restrict Id
                          </p>
                          <p class="font-medium">
                            {{ account.postingRestrictId || "-" }}
                          </p>
                        </div>
                      </div>
                    </UiAccordionContent>
                  </UiAccordionItem>
                  <!-- 
  <UiPermissionGuard permission="CREATE_CONTRACT_ACCOUNTS" >
        <div class="flex justify-end pt-4">
      <UiButton @click="addAccounts" type="submit" class="w-fit self-end px-8">Add Accounts</UiButton>
      </div>
      </UiPermissionGuard> -->
                </UiAccordion>
                <!-- </div> -->
                <UiCard
                  v-else-if="
                    accountsData &&
                    accountsData.length === 0 &&
                    !loading &&
                    !isError
                  "
                  class="w-full p-6 text-center"
                >
                  <p class="text-muted-foreground py-8">
                    No accounts found for this customer
                  </p>
                </UiCard>
                <div class="w-full" v-else-if="isError">
                  <ErrorMessage
                    :title="errorMessage || 'Something went wrong.'"
                    :retry="fetchData"
                  />
                </div>
              </UiCard>
            </div>

            <div class="col-span-full w-full py-4 flex justify-between">
              <UiButton
                :disabled="isSubmitting"
                variant="outline"
                type="button"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <UiButton :disabled="isSubmitting" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Submit
              </UiButton>
            </div>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>
