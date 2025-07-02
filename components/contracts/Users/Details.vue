<script lang="ts" setup>
const openItems = ref("contractDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { updateContractUserFormSchema } from "~/validations/updateContractUserFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type {  ContractUser, ServiceDefinitionRole } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {  getServiceDefinitionRolesByServiceDefinitionId } = useServiceDefinitionsRoles();
const { getContractUserById, updateContractUser } = useContractsUsers();
const { getContractById } = useContracts();

const contractUserId = ref<string>("");
const loading = ref(false);
const submitting = ref(false);
const serviceDefinitionRolesData = ref<ServiceDefinitionRole[]>([]);
const isError = ref(false);
const data = ref<ContractUser>({});
const openUpdateUserModal = ref(false);
const contractId = ref<string>()
const serviceDefinitionId = ref<string>()


contractId.value = getIdFromPath()

const props = defineProps<{
  id: string;
}>();

if (props.id) {
  contractUserId.value = props.id;
}

const form = useForm({
  validationSchema: updateContractUserFormSchema,
});

const setOpenNewUserModal = (value: boolean) => {
  openUpdateUserModal.value = value;
};


const fetchContractUser = async() => {
  try {
    loading.value = true;
    data.value = await getContractUserById(contractUserId.value);
    console.log("data: ", data.value);
    form.setValues({
      ...data.value,
      serviceDefinitionRole: data.value.serviceDefinitionRole?.id
    });
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
    if(serviceDefinitionId.value){
      const response = await getServiceDefinitionRolesByServiceDefinitionId(serviceDefinitionId.value);
      serviceDefinitionRolesData.value = response;
    }
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchContractDetails = async () => {
  try {
    loading.value = true;
    if(contractId.value){
      const response = await getContractById(contractId.value);
      serviceDefinitionId.value = response?.serviceDefinition?.id || ""
    }
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchContractDetails()
  await fetchServiceDefinitionRoles();
  await fetchContractUser();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    const newValues = {
      ...values,
      serviceDefinitionRole: serviceDefinitionRolesData.value.find((service: ServiceDefinitionRole) => service.id === values.serviceDefinitionRole),
    }
    console.log("newValues: ", newValues);
    data.value = await updateContractUser(contractUserId.value, newValues); // Call your API function to fetch profile
    // navigateTo(`/contracts/${data.value.id}`);
    toast({
      title: "Contract User Updated",
      description: "Contract user updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating contract user:", err);
    isError.value = true;
  } finally {
    submitting.value = false;
    openUpdateUserModal.value = false;
  }
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  async (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    if (newActiveTab == "contractDetails" || newActiveTab == "contractPermissions" || newActiveTab == "contractCoreCustomers" || newActiveTab == "contractRoleDetails" || newActiveTab == "newContractRole") {
      await fetchContractDetails()
      await fetchServiceDefinitionRoles();
      await fetchContractUser();
    }
  }
  }
);

const refetch = async() => {
  await fetchContractDetails()
  await fetchServiceDefinitionRoles();
  await fetchContractUser();
}
</script>

<template>
  <AlertDialog 
        :open="openUpdateUserModal"
        :onOpenChange="setOpenNewUserModal"
  >
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
          <FormField v-slot="{ componentField }" name="customer.fullName">
            <FormItem>
              <FormLabel>Customer</FormLabel>
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
          <FormField v-slot="{ componentField }" name="serviceDefinitionRole">
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
                        :value="item.id"
                              >
                                {{ item?.roleName }}
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

            <UiPermissionGuard
              :permission="PermissionConstants.READ_CONTRACT_CORE_CUSTOMER_PERMISSION"
            >
              <div class="w-full space-y-2">
                <UiLabel for="enable">User Accounts</UiLabel>
                <UiSheet class="w-full">
                  <UiSheetTrigger class="w-full">
                    <UiButton
                      size="lg"
                      variant="outline"
                      type="button"
                      class="font-medium bg-[#8C2A7C]/15 text-primary hover:bg-[#8C2A7C]/20 cursor-pointer w-full"
                    >
                      <Icon name="lucide:shield" class="h-4 w-4 mr-2" />
                      View Accounts
                    </UiButton>
                  </UiSheetTrigger>
                  <UiSheetContent
                    class="md:min-w-[75%] sm:min-w-full flex flex-col h-full overflow-y-auto"
                  >
                    <ContractsUsersAccounts
                      :userId = "data?.user?.id || '' "
                      :contractUserId= "contractUserId ||  '' "
                      :contract= "data?.contract || '' "
                      :serviceDefinitionRoleIdProps = data.serviceDefinitionRole?.id
                      @refresh="refetch"
                    />
                  </UiSheetContent>
                </UiSheet>
              </div>
            </UiPermissionGuard>

          <div class="col-span-full w-full py-4 flex justify-between">
            <UiAlertDialogCancel  @click="setOpenNewUserModal(false)">
                Cancel
          </UiAlertDialogCancel>
          <UiPermissionGuard :permission="PermissionConstants.UPDATE_CONTRACT_USER" >

          <!-- <UiAlertDialogCancel  class="w-fit p-0"> -->
            <UiButton :disabled="submitting" class="w-fit" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="submitting"
                :diabled = "submitting"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          <!-- </UiAlertDialogCancel > -->
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
