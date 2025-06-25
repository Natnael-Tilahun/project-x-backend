<script lang="ts" setup>
const openItems = ref(["item-1"]);

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
import type { ServiceDefinition, Permission } from "~/types";
import { PermissionCategory } from "~/global-types";
import { getIdFromPath } from "~/lib/utils";

const route = useRoute();
const { createNewServiceDefinitionPermission,getServiceDefinitionPermissions, isLoading, isSubmitting } =
  useServiceDefinitions();
const { getPermissions } = usePermissions();

const serviceDefinitionId = ref<string>("");
serviceDefinitionId.value = getIdFromPath(route.path);

const selectedPermissions = ref<string[]>([]);
const permissionsData = ref<Permission[]>([]);
const isError = ref(false);
const data = ref<Permission[]>();

const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
// const serviceDefinition = ref<ServiceDefinition>();

// const props = defineProps<{
//   serviceDefinitionProps?: ServiceDefinition;
// }>();

// if (props?.serviceDefinitionPermissionsProps) {
//   serviceDefinition.value = props?.serviceDefinitionProps;
//   data.value = serviceDefinition.value;
//   selectedPermissions.value = serviceDefinition.value?.permissions || [];
// }

const form = useForm({
  validationSchema: "",
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      permissionCodes: selectedPermissions.value,
    };
    console.log("new values: ", newValues)
    data.value = await createNewServiceDefinitionPermission(
      serviceDefinitionId.value,
      newValues
    );
    toast({
      title: "Service Definition Permissions Updated",
      description: "Service Definition Permissions updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating service definition permissions:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const response = await getPermissions(0, 100000);
    permissionsData.value = response.filter((permission: Permission) => permission.category == PermissionCategory.CUSTOMER)
    console.log("customer permissionsData.value: ", permissionsData.value);
  } catch (err) {
    console.error("Error fetching permissions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const fetchServiceDefinitionPermissions = async() => {
try {
  isLoading.value = true;
  loading.value = true;
  const response = await getServiceDefinitionPermissions(serviceDefinitionId.value);
  selectedPermissions.value = response?.map(permission => permission.permissionCode) || []
  console.log("permissions response: ", selectedPermissions.value)
} catch (err) {
  console.error("Error fetching service definition permissions:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

await useAsyncData("permissionsData", async () => {
  await fetchData();
  await fetchServiceDefinitionPermissions()
});

// Add computed property to check if all permissions are selected
const allSelected = computed(() => {
  if (!permissionsData.value || permissionsData.value.length === 0)
    return false;
  return permissionsData.value.every((permission) =>
    selectedPermissions.value.some((p) => p === permission.code)
  );
});

// Function to select all permissions
const selectAll = () => {
  selectedPermissions.value = permissionsData.value.map(permission => permission.code);
};

// Function to deselect all permissions
const deselectAll = () => {
  selectedPermissions.value = [];
};
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="permissionsData.length > 0 && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div class="col-span-full flex flex-col justify-start w-full gap-4">
            <p class="font-medium text-lg">Available Permissions</p>
              <UiPermissionGuard permission="UPDATE_SERVICE_DEFINITION_PERMISSIONS">
            <div class="col-span-full w-full  p-4 rounded-lg flex justify-between gap-8 border ">
              <UiButton
                :disabled="submitting"
                variant="outline"
                type="button"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <div class="flex gap-4 items-center">
                <div class="flex items-center justify-between  w-full gap-4">
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
          </UiPermissionGuard>          
          </div>

          <FormField
            v-for="permission in permissionsData"
            :key="permission.code"
            :model-value="
              selectedPermissions.some((p) => p === permission.code)
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
                    selectedPermissions.some((p) => p === permission.code)
                  "
                  @update:checked="
                    (checked) => {
                      if (checked) {
                        selectedPermissions.push(permission.code);
                      } else {
                        selectedPermissions = selectedPermissions.filter(
                          (p) => p !== permission.code
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
          <UiPermissionGuard permission="UPDATE_SERVICE_DEFINITION_PERMISSIONS">
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
    <div class="w-full p-6" v-else-if="permissionsData.length == 0">
      <UiNoResultFound title="Sorry, No customer permission found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
