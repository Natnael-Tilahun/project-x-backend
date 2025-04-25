<script lang="ts" setup>
const openItems = ref("contractDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractUserFormSchema } from "~/validations/newContractUserFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type {  ContractUser, ServiceDefinitionRole } from "~/types";

const route = useRoute();
const { getServiceDefinitionsRoles } = useServiceDefinitionsRoles();
const { getContractUserById, updateContractUser } = useContractsUsers();
const contractUserId = ref<string>("");
const loading = ref(false);
const submitting = ref(false);
const serviceDefinitionRolesData = ref<ServiceDefinitionRole[]>([]);
const isError = ref(false);
const data = ref<ContractUser>({});

const props = defineProps<{
  id: string;
}>();

if (props.id) {
  contractUserId.value = props.id;
}

const form = useForm({
  validationSchema: newContractUserFormSchema,
});

const fetchContract = async() => {
try {
  loading.value = true;
  data.value = await getContractUserById(contractUserId.value);
  console.log("data: ", data.value);
  form.setValues(data.value);
} catch (err) {
  console.error("Error fetching contract:", err);
  isError.value = true;
} finally {
  loading.value = false;
}
}

const fetchServiceDefinitionRoles = async () => {
  try {
    loading.value = true;
    const response = await getServiceDefinitionsRoles();
    serviceDefinitionRolesData.value = response;
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchContract();
  fetchServiceDefinitionRoles();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    const newValues = {
      ...values,
      serviceDefinitionRole: serviceDefinitionRolesData.value.find((service: ServiceDefinitionRole) => service.id === values.serviceDefinitionRole.id),
    }
    console.log("newValues: ", newValues);
    data.value = await updateContractUser(contractUserId.value, newValues); // Call your API function to fetch profile
    // navigateTo(`/contracts/${data.value.id}`);
    toast({
      title: "Contract Updated",
      description: "Contract updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating contract:", err);
    isError.value = true;
  } finally {
    submitting.value = false;
  }
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    if (newActiveTab == "contractDetails" || newActiveTab == "contractPermissions" || newActiveTab == "contractCoreCustomers" || newActiveTab == "contractRoleDetails" || newActiveTab == "newContractRole") {
      fetchContract();
    }
  }
  }
);
</script>

<template>
  <AlertDialog>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>

    <div v-if="data && !loading" class="w-full border-0 flex flex-col gap-4">
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Update Cotract User</UiAlertDialogTitle>
      </UiAlertDialogHeader>
      <UiSeparator />

      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-8">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Contract User Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter contract User Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="user.id">
            <FormItem>
              <FormLabel>User </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter User"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="col-span-full w-full">
          <FormField v-slot="{ componentField }" name="serviceDefinitionRole.id">
              <FormItem>
                <FormLabel> Service Definition Role </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service definition role" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                                v-for="item in serviceDefinitionRolesData"
                                :value="item?.id || ''"
                              >
                                {{ item?.role?.name }}
                              </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
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
            <FormField v-slot="{ value, handleChange }" name="isPrimaryUser">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Is Primary User </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>

          <div class="col-span-full w-full py-4 flex justify-between">
            <UiAlertDialogCancel >
                Cancel
          </UiAlertDialogCancel>
          <UiPermissionGuard permission="UPDATE_CONTRACT_USERS" >

          <UiAlertDialogCancel  class="w-fit p-0">
            <UiButton :disabled="submitting" class="w-fit" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="loading"
                :diabled = "loading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </UiAlertDialogCancel >
        </UiPermissionGuard>

          </div>
        </div>
      </form>
    </div>
    <div v-else-if="!loading || data == null || data == undefined">
      <UiNoResultFound title="Sorry, No contract found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
  </AlertDialog>
</template>

<style lang="css" scoped></style>
