<script lang="ts" setup>
const openItems = ref("permissions");

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
const { getContractCoreCustomerById, updateContractCoreCustomer, isLoading, isSubmitting } =
  useContractsCoreCustomers();

const contractId = ref<string>("");
const contractCoreCustomerId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<ContractCoreCustomer>();
const contractData = ref<Contract>();
const permissionsData = ref<Permission[]>([]);
  contractId.value = getIdFromPath();
contractCoreCustomerId.value = route.query.coreCustomerId as string;

const props = defineProps<{
  contractProps: Contract;
}>();

if(props.contractProps){
  contractData.value = props.contractProps;
  permissionsData.value =contractData.value?.permissions as Permission[];
} 


const form = useForm({
  validationSchema: newContractCoreCustomerFormSchema,
});

const fetchContractCoreCustomer = async() => {

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getContractCoreCustomerById(contractId.value, contractCoreCustomerId.value);
  form.setValues(data.value);
} catch (err) {
  console.error("Error fetching contract core customer:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

onMounted(() => {
  fetchContractCoreCustomer();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      contract: contractData.value
    }
    console.log(newValues);
    data.value = await updateContractCoreCustomer(contractId.value, contractCoreCustomerId.value, newValues); // Call your API function to fetch profile
    // navigateTo(`/contracts/${contractId.value}/contractCoreCustomers`);
    toast({
      title: "Contract Core Customer Updated",
      description: "Contract Core Customer updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating contract core customer:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.coreCustomerActiveTab,
  (newActiveTab) => {
    console.log("openItems: ", newActiveTab);
    if ( newActiveTab == "permissions" || newActiveTab == "newContractCoreCustomerAccount" || newActiveTab == "contractCoreCustomersAccounts") {
      fetchContractCoreCustomer();
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <div class="w-full flex flex-col gap-4 " v-else-if="data && !isError">

    <UiCard class="w-full p-6">
      <form @submit="onSubmit">
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
          <FormField v-slot="{ value, handleChange }" name="enable">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Enable </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>
          <div class="col-span-full w-full py-4 flex justify-between">
            <UiButton
              :disabled="submitting"
              variant="outline"
              type="button"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton :disabled="submitting" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="submitting"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div>
        </div>
      </form>
    </UiCard>
    <UiTabs
      v-model="openItems"
      class="w-full space-y-0 border rounded-lg p-"
    >
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <!-- <UiTabsTrigger
          value="details"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Details
        </UiTabsTrigger> -->
        <UiTabsTrigger
          value="permissions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                coreCustomerActiveTab: 'permissions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
        Permissions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="accounts"
          @click="
            navigateTo({
              path: route.path,
              query: {
                coreCustomerActiveTab: 'accounts',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
        Accounts
        </UiTabsTrigger>

        <UiTabsTrigger
          value="newAccount"
          @click="
            navigateTo({
              path: route.path,
              query: {
                coreCustomerActiveTab: 'newAccount',
              },
            })
          "
     
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Account
        </UiTabsTrigger>

      </UiTabsList>
 
    <UiTabsContent
    value="permissions"
    class="text-base bg-background rounded-lg p-4"
    >
    <ContractsCoreCustomersPermissions :contractCoreCustomerProps="data" :permissionsData="permissionsData" />
    </UiTabsContent>
    <UiTabsContent
    value="accounts"
    class="text-base bg-background rounded-lg p-4"
    >
    <ContractsAccounts :contractCoreCustomerProps="data" :contractId="contractId" />
    </UiTabsContent>
    <UiTabsContent
    value="newAccount"
    class="text-base bg-background rounded-lg p-4"
    >
    <ContractsAccountsNewAccount :coreCustomerId="data?.id || ''"  />
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
