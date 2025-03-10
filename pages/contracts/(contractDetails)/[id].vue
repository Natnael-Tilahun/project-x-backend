<script lang="ts" setup>
const openItems = ref("contractDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newContractFormSchema } from "~/validations/newContractFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Contract, ServiceDefinition } from "~/types";
import { ServiceType } from "~/global-types";

const route = useRoute();
const { getContractById, updateContract, isLoading, isSubmitting } =
  useContracts();
const { getServiceDefinitions } = useServiceDefinitions();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const contractId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const serviceDefinitionsData = ref<ServiceDefinition[]>([]);

const isError = ref(false);
const data = ref<Contract>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
contractId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newContractFormSchema,
});

const fetchContract = async() => {

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getContractById(contractId.value);
  serviceDefinitionsData.value = await getServiceDefinitions();
  let a = {
        ...data.value,
        serviceDefinition: data.value?.serviceDefinition?.id,
  };

  form.setValues(a);
} catch (err) {
  console.error("Error fetching contract:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

onMounted(() => {
  fetchContract();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      serviceDefinition: serviceDefinitionsData.value.find((service: ServiceDefinition) => service.id === values.serviceDefinition),
    }
    data.value = await updateContract(contractId.value, newValues); // Call your API function to fetch profile
    navigateTo(`/contracts/${data.value.id}`);
    toast({
      title: "Contract Updated",
      description: "Contract updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating contract:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
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
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiTabs
      v-else-if="data && !isError"
      v-model="openItems"
      class="w-full space-y-0"
    >
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="contractDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'contractDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Contract Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="contractPermissions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'contractPermissions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Contract Permissions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="contractCoreCustomers"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'contractCoreCustomers',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Contract Core Customers
        </UiTabsTrigger>
        <UiTabsTrigger
          value="newCoreCustomer"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newCoreCustomer',
              },
            })
          "
          :class="{
            hidden: openItems != 'newCoreCustomer'
          }"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Contract Core Customer
        </UiTabsTrigger>
        <UiTabsTrigger
          value="contractCoreCustomerDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'contractCoreCustomerDetails',
              },
            })
          "
          :class="{
            hidden: openItems != 'contractCoreCustomerDetails'
          }"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Contract Core Customer Details
        </UiTabsTrigger>

      </UiTabsList>
      <UiTabsContent
        value="contractDetails"
        class="text-base bg-background rounded-lg"
      >
    <UiCard  class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Contract Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter contract Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Contract Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter contract Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Contract Description </FormLabel>
              <FormControl>
                <UiTextarea
                  type="text"
                  placeholder="Enter contract Description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="serviceType">
              <FormItem>
                <FormLabel> Service Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(ServiceType)"
                        :value="item"
                      >
                        {{ item }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="serviceDefinition">
              <FormItem>
                <FormLabel> Service Definition </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service definition" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in serviceDefinitionsData"
                        :value="item?.id || ''"
                      >
                        {{ item.name }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
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
    </UiTabsContent>
    <UiTabsContent
    value="contractPermissions"
    class="text-base bg-background rounded-lg"
    >
    <ContractPermissions :contractProps="data" />
    </UiTabsContent>
    <UiTabsContent
    value="contractCoreCustomers"
    class="text-base bg-background rounded-lg p-6"
    >
    <ContractsCoreCustomers :contractProps="data" />
    </UiTabsContent>
    <UiTabsContent
    value="newCoreCustomer"
    class="text-base bg-background rounded-lg p-6"
    >
    <ContractsNewCoreCustomers :contractProps="data" />
    </UiTabsContent>

    <UiTabsContent
    value="contractCoreCustomerDetails"
    class="text-base bg-background rounded-lg p-6"
    >
    <ContractsContractCoreCustomerDetails :contractProps="data" />
    </UiTabsContent>
    </UiTabs>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No contract found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
