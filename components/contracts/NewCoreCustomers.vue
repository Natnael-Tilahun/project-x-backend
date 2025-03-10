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
import { newContractCoreCustomerFormSchema } from "~/validations/newContractCoreCustomerFormSchema";
import { ServiceType } from "@/global-types";
import type { ContractCoreCustomer, Permission, ServiceDefinition, Contract } from "~/types";
const { createNewContractCoreCustomer, isLoading } = useContractsCoreCustomers();
const { getServiceDefinitions } = useServiceDefinitions();
const { getPermissions } = usePermissions();
const route = useRoute();
const isError = ref(false);
const data = ref<ContractCoreCustomer>();
const isSubmitting = ref(false);
const permissionsData = ref<Permission[]>([]);
const serviceDefinitionsData = ref<ServiceDefinition[]>([]);
const selectedPermissions = ref<Permission[]>([]);
const contractId = ref<string>("");
const contractData = ref<Contract>();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
contractId.value = pathSegments.value[pathLength - 1];

const props = defineProps<{
  contractProps: Contract;
}>();

if(props.contractProps){
  contractData.value = props.contractProps;
  permissionsData.value =contractData.value?.permissions as Permission[];
}

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newContractCoreCustomerFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      contract: contractData.value,
      permissions: selectedPermissions.value,
    }
    console.log(newValues);
    data.value = await createNewContractCoreCustomer(newValues); // Call your API function to fetch profile
    navigateTo(`/contracts/${contractId.value}?activeTab=contractCoreCustomers`);
    toast({
      title: "Contract Core Customer Created",
      description: "Contract Core Customer created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new contract:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

// const fetchData = async () => {
//   try {
//     const permissions = await getPermissions();
//     permissionsData.value = permissions.sort((a: Permission, b: Permission) =>
//       a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
//     );
//     const serviceDefinitions = await getServiceDefinitions();
//     serviceDefinitionsData.value = serviceDefinitions;
//   } catch (err) {
//     console.error("Error fetching permissions:", err);
//     isError.value = true;
//   } 
// };

// await useAsyncData("permissionsData", async () => {
//   await fetchData();
// });

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Contract Core Customer</h1>
      <p class="text-sm text-muted-foreground">
        Create new contract core customer by including permissions, contract, and
        core customer
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="coreCustomerId">
              <FormItem>
                <FormLabel>Core Customer Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter core customer id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.permissions"
              v-slot="{ componentField, errorMessage }"
              name="permissions"
            >
              <FormItem>
                <FormLabel>Select Permissions</FormLabel>
                <UiPopover>
                  <UiPopoverTrigger asChild>
                    <FormControl>
                      <div
                        variant="outline"
                        role="combobox"
                        class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                        :class="{
                          'text-muted-foreground':
                            !data?.permissions?.length,
                        }"
                      >
                        {{
                          selectedPermissions?.length
                            ? selectedPermissions
                                .map(
                                  (permission: Permission) => permission.code
                                )
                                .join(", ")
                            : "Select permissions"
                        }}
                        <Icon
                          name="material-symbols:unfold-more-rounded"
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </div>
                    </FormControl>
                  </UiPopoverTrigger>
                  <UiPopoverContent class="w-full self-start p-0">
                    <UiCommand>
                      <UiCommandInput placeholder="Search product menus..." />
                      <UiCommandList>
                        <UiCommandEmpty>No permissions found.</UiCommandEmpty>
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="permission in permissionsData"
                            :key="permission.code"
                            :value="permission.code"
                            @select="
                              () => {
                                const isSelected =
                                  selectedPermissions.some(
                                    (selected: Permission) => selected.code === permission.code
                                  );

                                if (isSelected) {
                                  selectedPermissions =
                                      selectedPermissions.filter(
                                      (selected: Permission) =>
                                        selected.code !== permission.code
                                    );
                                } else {
                                  selectedPermissions.push(permission);
                                }

                                form.setFieldValue(
                                  'permissions',
                                  selectedPermissions.map(
                                    (permission: Permission) => permission
                                  )
                                );
                              }
                            "
                          >
                            {{ permission.code }}
                            <UiCheckbox
                              :checked="
                                selectedPermissions.some(
                                  (selected: Permission) => selected.code === permission.code
                                )
                              "
                              class="ml-auto"
                            />
                          </UiCommandItem>
                        </UiCommandGroup>
                      </UiCommandList>
                    </UiCommand>
                  </UiPopoverContent>
                </UiPopover>
                <FormMessage>{{ errorMessage }}</FormMessage>
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
