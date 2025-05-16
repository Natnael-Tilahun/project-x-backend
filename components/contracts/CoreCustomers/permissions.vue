<script lang="ts" setup>
import { useContractsCoreCustomers } from "~/composables/useContractsCoreCustomers";

import { useForm } from "vee-validate";
import { ref, computed } from "vue";
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

// Add computed property to check if all permissions are selected
const allSelected = computed(() => {
  if (!permissionsData.value || permissionsData.value.length === 0)
    return false;
  return permissionsData.value.every((permission) =>
    selectedPermissions.value.some((p) => p.code === permission.code)
  );
});

// Function to select all permissions
const selectAll = () => {
  selectedPermissions.value = [...permissionsData.value];
};

// Function to deselect all permissions
const deselectAll = () => {
  selectedPermissions.value = [];
};

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
        >Contract Core Customer Permissions</UiSheetTitle
      >
      <UiSheetDescription class="py-4 space-y-4">
        <div v-if="loading" class="py-10 flex justify-center w-full">
          <UiLoading />
        </div>
        <UiCard
          v-else-if="permissionsData && permissionsData.length > 0 && !isError"
          class="w-full p-6"
        >
          <form @submit="onSubmit">
            <UiPermissionGuard
                permission="UPDATE_CONTRACT_CORE_CUSTOMER_PERMISSIONS"
              >
                <div class="col-span-full w-full pb-4 flex justify-between">
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
              </UiPermissionGuard>
            <div
              class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <!-- Add select all controls -->
              <div class="col-span-full flex justify-between items-center mb-4">
                <p class="font-medium">Available Permissions</p>
                <div class="flex items-center gap-2">
                  <p class="text-sm text-muted-foreground">
                    {{ selectedPermissions.length }} of
                    {{ permissionsData.length }} selected
                  </p>
                  <div class="flex gap-2">
                    <UiButton
                      variant="outline"
                      size="sm"
                      @click="selectAll"
                      :disabled="allSelected"
                      type="button"
                    >
                      Select All
                    </UiButton>
                    <UiButton
                      variant="outline"
                      size="sm"
                      @click="deselectAll"
                      :disabled="selectedPermissions.length === 0"
                      type="button"
                    >
                      Deselect All
                    </UiButton>
                  </div>
                </div>
              </div>

              <FormField
                v-for="permission in permissionsData"
                :key="permission.code"
                :model-value="
                  selectedPermissions.some((p) => p.code === permission.code)
                "
                v-slot="{ handleChange }"
                name="permissions"
              >
                <FormItem
                  class="flex items-start space-x-3 space-y-0 p-2 rounded-md hover:bg-muted/50"
                >
                  <FormControl>
                    <UiCheckbox
                      class="order-first self-center"
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
                  <FormLabel class="font-normal text-sm">
                    {{ permission.code }}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              </FormField>
              <UiPermissionGuard
                permission="UPDATE_CONTRACT_CORE_CUSTOMER_PERMISSIONS"
              >
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
              </UiPermissionGuard>
            </div>
          </form>
        </UiCard>
        <div
          v-else-if="
            data == null || data == undefined || permissionsData.length == 0
          "
        >
          <UiNoResultFound
            title="Sorry, No core customer level permissions found."
          />
        </div>
        <div v-else-if="isError">
          <ErrorMessage title="Something went wrong." />
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
