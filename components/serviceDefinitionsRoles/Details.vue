<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newServiceDefinitionRoleFormSchema } from "~/validations/newServiceDefinitionRoleFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ServiceDefinitionRole, ServiceDefinition, Role, Permission } from "~/types";
import { useServiceDefinitionsRoles } from "@/composables/useServiceDefinitionsRoles";
import { useRoles } from "@/composables/useRoles";

const route = useRoute();
const { getServiceDefinitionRoleById, updateServiceDefinitionRole, isLoading, isSubmitting } =
  useServiceDefinitionsRoles();

const serviceDefinitionRoleId = ref<string>("");
serviceDefinitionRoleId.value = route.query.serviceDefinitionRoleId as string;

const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const serviceDefinition = ref<ServiceDefinition>();
const permissionsData = ref<Permission[]>([])

const props = defineProps<{
  serviceDefinitionProps?: ServiceDefinition;
}>();

if (props?.serviceDefinitionProps) {
  serviceDefinition.value = props?.serviceDefinitionProps;
}

const isError = ref(false);
const data = ref<ServiceDefinitionRole>();

const form = useForm({
  validationSchema: newServiceDefinitionRoleFormSchema,
});

console.log("serviceDefinitionProps: ",serviceDefinition.value)

const fetchServiceDefinitionRole = async() => {
try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getServiceDefinitionRoleById(serviceDefinitionRoleId.value);
  permissionsData.value = data.value?.permissions || []
  const newValues = {
    ...data.value,
    permissions: data.value?.permissions,
  }
  form.setValues(newValues);
} catch (err) {
  console.error("Error fetching service definition role:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
        ...values,
        serviceDefinition: serviceDefinition.value
    }
    data.value = await updateServiceDefinitionRole(values.id, newValues); // Call your API function to fetch profile
    toast({
      title: "Service Definition Role Updated",
      description: "Service Definition Role updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating service definition role:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});


await useAsyncData("permissionsData", async () => {
  await fetchServiceDefinitionRole()
});

const refetch = async() => {
  await fetchServiceDefinitionRole()
}
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter service definition role Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="roleName">
            <FormItem>
              <FormLabel>Role Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter service definition role name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="roleDescription">
            <FormItem>
              <FormLabel>Role Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter service definition role description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
            <FormField
                :model-value="data?.isDefault"
                v-slot="{ value, handleChange }"
                name="isDefault"
              >
                <FormItem>
                  <FormLabel> Is Default </FormLabel>
                  <FormControl>
                    <UiSwitch :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <UiPermissionGuard
              permission="UPDATE_SERVICE_DEFINITION_ROLES"
            >
              <div class="w-full space-y-2">
                <UiLabel for="enable">Permissions</UiLabel>
                <UiSheet class="w-full">
                  <UiSheetTrigger class="w-full">
                    <UiButton
                      size="lg"
                      variant="outline"
                      type="button"
                      class="font-medium bg-[#8C2A7C]/15 text-primary hover:bg-[#8C2A7C]/20 cursor-pointer w-full"
                    >
                      <Icon name="lucide:shield" class="h-4 w-4 mr-2" />
                      Service Definition Role Permissions
                    </UiButton>
                  </UiSheetTrigger>
                  <UiSheetContent
                    class="md:min-w-[75%] sm:min-w-full flex flex-col h-full overflow-y-auto"
                  >
                    <ServiceDefinitionsRolesPermissions
                      :serviceDefinitionsProps="serviceDefinition"
                      :permissionsData="permissionsData"
                      @refresh="refetch"
                    />
                  </UiSheetContent>
                </UiSheet>
              </div>
            </UiPermissionGuard>

          <UiPermissionGuard permission="UPDATE_SERVICE_DEFINITION_ROLES" >
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No Roles found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
