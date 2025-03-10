<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
// import { newServiceDefinitionFormSchema } from "~/validations/newServiceDefinitionFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ServiceDefinition, Permission, Contract, ContractCoreCustomer } from "~/types";

const route = useRoute();
const { updateContractCoreCustomerPermissions, isLoading, isSubmitting } = useContractsCoreCustomers();
const { getPermissions } = usePermissions();
const {getServiceDefinitionById} = useServiceDefinitions()

const pathSegments = ref([]);
pathSegments.value = splitPath(route.path);
const pathLength = pathSegments.value.length;
const contractId = ref<string>("");
const contractCoreCustomerId = ref<string>("");
contractId.value = pathSegments.value[pathLength - 1];
contractCoreCustomerId.value = route.query.coreCustomerId as string;

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const selectedPermissions = ref<Permission[]>([]);
const permissionsData = ref<Permission[]>([]);
const isError = ref(false);
const data = ref<ContractCoreCustomer>();

const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const contract = ref<Contract>();

const props = defineProps<{
  contractCoreCustomerProps?: ContractCoreCustomer;
  permissionsData?: Permission[];
}>();

if (props?.contractCoreCustomerProps) {
  data.value = props?.contractCoreCustomerProps;
  selectedPermissions.value = data.value?.permissions || [];
}

if (props?.permissionsData) {
  permissionsData.value = props?.permissionsData;
}

const form = useForm({
  validationSchema: '',
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      permissionCodes: selectedPermissions.value.map((permission: any) => permission.code)
    }
    data.value = await updateContractCoreCustomerPermissions(contractCoreCustomerId.value, newValues);
    toast({
      title: "Contract Permissions Updated",
      description: "Contract Permissions updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating contract permissions:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="permissionsData && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
                v-for="permission in permissionsData"
                :key="permission.code"
                :model-value="selectedPermissions.some(p => p.code === permission.code)"
                v-slot="{ handleChange }"
                name="permissions"
              >
                <FormItem>
                  <FormLabel> {{ permission.code }} </FormLabel>
                  <FormControl>
                    <UiSwitch 
                      :checked="selectedPermissions.some(p => p.code === permission.code)"
                      @update:checked="(checked) => {
                        if (checked) {
                          selectedPermissions.push(permission);
                        } else {
                          selectedPermissions = selectedPermissions.filter(p => p.code !== permission.code);
                        }
                      }"
                    />
                  </FormControl>
                  <FormMessage />
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No merchant found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
