<script lang="ts" setup>
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
import { newContractCoreCustomerAccountFormSchema } from "~/validations/newContractCoreCustomerAccountFormSchema";
import type { ContractCoreCustomer, Permission, Contract, ContractAccount } from "~/types";
import { getIdFromPath } from "~/lib/utils";

const { createNewContractAccount, isLoading } = useContractsCoreCustomers();
const isError = ref(false);
const data = ref<ContractAccount>();
const isSubmitting = ref(false);
const permissionsData = ref<Permission[]>([]);
const selectedPermissions = ref<Permission[]>([]);
const contractId = ref<string>("");
const contractData = ref<Contract>();
const coreCustomerId = ref<string>("");
contractId.value = getIdFromPath();

const props = defineProps<{
  coreCustomerId: string;
}>();

    if(props.coreCustomerId){
  coreCustomerId.value = props.coreCustomerId;
}
console.log("coreCustomerId: ", coreCustomerId.value);
console.log("contractId: ", contractId.value);

const form = useForm({
  validationSchema: newContractCoreCustomerAccountFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = { 
        "coreAccounts": [
            {
            "accountNumber": values.accountNumber
            }
        ]
    }
    console.log(newValues);
    data.value = await createNewContractAccount(coreCustomerId.value, newValues); // Call your API function to fetch profile
    navigateTo(`/contracts/${contractId.value}?activeTab=contractCoreCustomersDetails&&coreCustomerId=${coreCustomerId.value}&&coreCustomerActiveTab=accounts`);
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
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Contract Core Customer Account</h1>
      <p class="text-sm text-muted-foreground">
        Create new contract core customer account by including account number
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="accountNumber">
              <FormItem>
                <FormLabel>Account Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter account number"
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
