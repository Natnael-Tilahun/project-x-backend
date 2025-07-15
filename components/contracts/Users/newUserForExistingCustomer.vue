<script lang="ts" setup>
const openItems = ref("accounts");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractUserForExistingCustomerFormSchema } from "~/validations/newContractUserForExistingCustomerFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type {
  Contract,
  Permission,
  User,
  ServiceDefinitionRole,
} from "~/types";
import { copyToClipboard, getIdFromPath } from "~/lib/utils";

const route = useRoute();
const { createNewContractForExistingUser, createNewContractForNewUser } =
  useContractsUsers();
const { getServiceDefinitionsRoles, getServiceDefinitionRolesByServiceDefinitionId } = useServiceDefinitionsRoles();

const contractId = ref<string>("");
const serviceDefinitionId = ref<string>("");
const contractCoreCustomerId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<User | null>(null);
const contractData = ref<Contract>();
const openExistingUserModal = ref(false);
const serviceDefinitionRolesData = ref<ServiceDefinitionRole[]>([]);

contractId.value = getIdFromPath();
contractCoreCustomerId.value = route.query.coreCustomerId as string;

const props = defineProps<{
  contractProps?: Contract;
  data?: User | null;
}>();

const emit = defineEmits(["close"]);

if (props.contractProps) {
  contractData.value = props.contractProps;
  data.value = props.data;
  serviceDefinitionId.value = contractData.value.serviceDefinition.id
}

const form = useForm({
  validationSchema: newContractUserForExistingCustomerFormSchema,
  initialValues: {
    isPrimaryUser: false,
    enable: true,
  },
});

const fetchServiceDefinitionRoles = async () => {
  try {
    loading.value = true;
    const response = await getServiceDefinitionRolesByServiceDefinitionId(serviceDefinitionId.value);
    serviceDefinitionRolesData.value = response;
  } catch (err) {
    console.error("Error fetching service definition roles:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const refetch = async () => {
  isError.value= false
  await fetchServiceDefinitionRoles();
};

onMounted(() => {
  fetchServiceDefinitionRoles();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    if (!data.value || !contractId.value) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "User or contract not found.",
        variant: "destructive",
      });
      return;
    }

    const newValues = {
      ...values,
      contract: {
        id: contractId.value,
      },
      customerId: data.value?.id,
      serviceDefinitionRoleId: values.serviceDefinitionRoleId,
    };

    console.log("newValues: ", newValues);

    const response = await createNewContractForExistingUser(
      contractId.value,
      newValues
    ); // Call your API function to fetch roles
    // usersData.value = response;
    //  data.value = usersData.value[0]  || {}
    // console.log("usersData: ", usersData.value);
    // console.log("dataa: ", data.value);
    //   userCustomerId.value = userData.value?.customerId;
    navigateTo(`${route.path}?activeTab=contractUsers`);
    toast({
      title: "Contract Created",
      description: "Contract user created successfully",
    });
    emit('close'); // Emit close event after successful submission
  } catch (err: any) {
    console.error("Error creating contract user:", err);
    toast({
      title: "Error",
      description: err.message || "Failed to create contract user",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <form @submit="onSubmit">
    <UiAlertDialogHeader>
      <UiAlertDialogTitle>Add New User To Contract</UiAlertDialogTitle>
      <UiSeparator />
      <UiAlertDialogDescription>
        <div class="grid grid-cols-2 gap-6">
          <div class="col-span-full">
            <FormField
              v-slot="{ componentField }"
              name="serviceDefinitionRoleId"
            >
              <FormItem>
                <FormLabel> Service Definition Role </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select a service definition role"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in serviceDefinitionRolesData"
                        :key="item.id"
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
        </div>
      </UiAlertDialogDescription>
    </UiAlertDialogHeader>
    <UiAlertDialogFooter class="flex justify-end pt-8">
      <UiAlertDialogCancel @click="emit('close')">
        Cancel
      </UiAlertDialogCancel>
      <UiButton type="submit">
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="loading"
          :disabled="loading"
          class="mr-2 h-4 w-4 animate-spin"
        ></Icon>
        Continue
      </UiButton>
    </UiAlertDialogFooter>
  </form>
</template>

<style lang="css" scoped></style>
