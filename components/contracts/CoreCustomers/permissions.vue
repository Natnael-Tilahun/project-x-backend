<script lang="ts" setup>
import { useContractsCoreCustomers } from "~/composables/useContractsCoreCustomers";

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
import type { Permission, ContractCoreCustomer } from "~/types";
import { getIdFromPath } from "~/lib/utils";

const route = useRoute();
const { updateContractCoreCustomerPermissions, isLoading, isSubmitting } =
  useContractsCoreCustomers();

const contractId = ref<string>("");
contractId.value = getIdFromPath();

const contractCoreCustomerId = ref<string>("");
contractCoreCustomerId.value = route.query.coreCustomerId as string;

const selectedPermissions = ref<Permission[]>([]);
const permissionsData = ref<Permission[]>([]);
const isError = ref(false);
const data = ref<ContractCoreCustomer>();

const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);

const props = defineProps<{
  contractCoreCustomerProps?: ContractCoreCustomer;
  permissionsData?: Permission[];
}>();

const emit = defineEmits(["refresh"]);

if (props?.contractCoreCustomerProps) {
  data.value = props?.contractCoreCustomerProps;
  selectedPermissions.value = data.value?.permissions || [];
}

if (props?.permissionsData) {
  permissionsData.value = props?.permissionsData;
}

const form = useForm({
  validationSchema: "",
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      permissionCodes: selectedPermissions.value.map(
        (permission: any) => permission.code
      ),
    };
    data.value = await updateContractCoreCustomerPermissions(
      contractCoreCustomerId.value,
      newValues
    );
    toast({
      title: "Contract Core Customer Permissions Updated",
      description: "Contract Core Customer Permissions updated successfully",
    });
    emit("refresh");
  } catch (err: any) {
    console.error("Error updating contract core customer permissions:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});
</script>

<template>
  <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2"
        >Contract Account Permissions</UiSheetTitle
      >
      <UiSheetDescription class="py-4 space-y-4">
        <div v-if="loading" class="py-10 flex justify-center w-full">
          <UiLoading />
        </div>
        <UiCard v-else-if="permissionsData && permissionsData.length > 0 && !isError" class="w-full p-6">
          <form @submit="onSubmit">
            <div class="grid grid-cols-2 gap-6">
              <FormField
                v-for="permission in permissionsData"
                :key="permission.code"
                :model-value="
                  selectedPermissions.some((p) => p.code === permission.code)
                "
                v-slot="{ handleChange }"
                name="permissions"
              >
                <FormItem>
                  <FormLabel> {{ permission.code }} </FormLabel>
                  <FormControl>
                    <UiSwitch
                      :checked="
                        selectedPermissions.some(
                          (p) => p.code === permission.code
                        )
                      "
                      @update:checked="
                        (checked) => {
                          if (checked) {
                            selectedPermissions.push(permission);
                          } else {
                            selectedPermissions = selectedPermissions.filter(
                              (p) => p.code !== permission.code
                            );
                          }
                        }
                      "
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
        <div v-else-if="data == null || data == undefined || permissionsData.length == 0" >
          <UiNoResultFound title="Sorry, No core customer level permissions found." />
        </div>
        <div v-else-if="isError">
          <ErrorMessage title="Something went wrong." />
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
