<script lang="ts" setup>
const openItems = ref("accounts");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractCoreCustomerFormSchema } from "~/validations/newContractCoreCustomerFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ContractCoreCustomer, Contract, Permission } from "~/types";
import { getIdFromPath } from "~/lib/utils";

const route = useRoute();
const {
  getContractCoreCustomerById,
  updateContractCoreCustomerStatus,
  isLoading,
  isSubmitting,
} = useContractsCoreCustomers();

const contractId = ref<string>("");
const contractCoreCustomerId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<ContractCoreCustomer>();
const contractData = ref<Contract>();
const permissionsData = ref<Permission[]>([]);
const coreCustomerPermissionsData = ref<Permission[]>([]);

contractId.value = getIdFromPath();
contractCoreCustomerId.value = route.query.coreCustomerId as string;

const props = defineProps<{
  contractProps: Contract;
}>();

if (props.contractProps) {
  contractData.value = props.contractProps;
  permissionsData.value = contractData.value?.permissions as Permission[];
}

const form = useForm({
  validationSchema: newContractCoreCustomerFormSchema,
});

const fetchContractCoreCustomer = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const response = await getContractCoreCustomerById(
      contractId.value,
      contractCoreCustomerId.value
    );
    data.value = response;
    coreCustomerPermissionsData.value = data.value?.permissions as Permission[];
    console.log("datasadfad: ", data.value);
    form.setValues(data.value);
    form.setFieldValue("coreCustomerStatus", data.value?.enable);
  } catch (err) {
    console.error("Error fetching contract core customer:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const refetch = async () => {
  await fetchContractCoreCustomer();
};

onMounted(() => {
  fetchContractCoreCustomer();
});


const updatingContractCoreCustomerStatus = async (id: string, status: boolean) => {
  try {
    loading.value = true;
    if (id) {
      const value = status ? "enable" : "disable";
      await updateContractCoreCustomerStatus(id, value);
      await fetchContractCoreCustomer();
      toast({
        title: "Contract Core Customer Status Updated.",
        description: "Contract Core Customer staus updated successfully",
      });
    } else {
      return true;
    }
  } catch (err: any) {
    console.error("Error updating contract core customer:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <div class="w-full flex flex-col gap-4" v-else-if="data && !isError">
      <UiCard class="w-full p-6">
        <form>
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="id">
              <FormItem>
                <FormLabel>Contract Core Customer Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter contract Core Customer Id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="coreCustomerId">
              <FormItem>
                <FormLabel>Core Customer Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Core Customer Id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="fullName">
              <FormItem>
                <FormLabel>Full Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Full Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="salutation">
              <FormItem>
                <FormLabel>Salutation </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Salutation"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="gender">
              <FormItem>
                <FormLabel>Gender </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Gender"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="addressLine1">
              <FormItem>
                <FormLabel>Address Line 1 </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Address Line 1"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="addressLine2">
              <FormItem>
                <FormLabel>Address Line 2 </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Address Line 2"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="city">
              <FormItem>
                <FormLabel>City </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter City"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="state">
              <FormItem>
                <FormLabel>State </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter State"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="country">
              <FormItem>
                <FormLabel>Country </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter Country"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="isPrimary">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Is Primary </FormLabel>
                <FormControl>
                  <UiSwitch disabled :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="coreCustomerStatus">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Enable </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value"           
                  @update:checked="
                          (checked) => {
                            handleChange;
                            updatingContractCoreCustomerStatus(data?.id || '', checked);
                          }
                  " 
                  />
                </FormControl>
              </FormItem>
            </FormField>
            <div class="w-full space-y-2">
              <UiLabel for="enable">Permissions</UiLabel>
              <UiSheet class="w-full">
                <UiSheetTrigger class="w-full">
                  <UiButton
                    size="lg"
                    variant="outline"
                    type="button"
                    class="font-medium cursor-pointer w-full"
                  >
                    Contract Core Customer Permissions
                  </UiButton>
                </UiSheetTrigger>
                <UiSheetContent
                  class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
                >
                  <ContractsCoreCustomersPermissions
                    :contractCoreCustomerProps="data"
                    :permissionsData="permissionsData"
                  />
                </UiSheetContent>
              </UiSheet>
            </div>

          </div>
        </form>
      </UiCard>
      <UiTabs v-model="openItems" class="w-full space-y-0 border rounded-lg p-">
        <UiTabsList
          class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
        >
          <!-- <UiTabsTrigger
          value="details"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Details
        </UiTabsTrigger> -->
          <!-- <UiTabsTrigger
            value="permissions"
            @click="
              navigateTo({
                path: route.fullPath,
                query: {
                  ...route.query,
                  coreCustomerActiveTab: 'permissions',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Permissions
          </UiTabsTrigger> -->
          <UiTabsTrigger
            value="accounts"
            @click="
              navigateTo({
                path: route.fullPath,
                query: {
                  ...route.query,
                  coreCustomerActiveTab: 'accounts',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Contract Accounts
          </UiTabsTrigger>
        </UiTabsList>

        <!-- <UiTabsContent
          value="permissions"
          class="text-base bg-background rounded-lg p-4"
        >
          <ContractsCoreCustomersPermissions
            :contractCoreCustomerProps="data"
            :permissionsData="permissionsData"
          />
          
        </UiTabsContent> -->
        <UiTabsContent
          value="accounts"
          class="text-base bg-background rounded-lg p-4"
        >
          <ContractsAccounts
            :contractCoreCustomerProps="data"
            :contractId="contractId"
            :coreCustomerPermissions="coreCustomerPermissionsData"
            @refresh="refetch"
          />
        </UiTabsContent>
      </UiTabs>
    </div>

    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No core customer found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
