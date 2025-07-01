<script lang="ts" setup>
const openItems = ref("serviceDefinitionDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newServiceDefinitionFormSchema } from "~/validations/newServiceDefinitionFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { ServiceDefinition, Permission, BankingService } from "~/types";
import { ServiceType, ServiceDefinitionStatus, PermissionCategory } from "@/global-types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const { getServiceDefinitionById, updateServiceDefinition, getServiceDefinitionPermissions,createNewServiceDefinitionPermission, isLoading, isSubmitting } =
  useServiceDefinitions();

const { getPermissions } = usePermissions();
const { getBankingServices } = useBankingServices();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const serviceDefinitionId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);

const isError = ref(false);
const data = ref<ServiceDefinition>();
const bankingServices = ref<BankingService[]>([]);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
serviceDefinitionId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newServiceDefinitionFormSchema,
});

const fetchServiceDefinitions = async() => {
try {
  isLoading.value = true;
  loading.value = true;
    data.value = await getServiceDefinitionById(serviceDefinitionId.value);
  bankingServices.value = await getBankingServices();
  let a = {
        ...data.value,
        service: data.value?.service?.id
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching service definition:", err);
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
      service: bankingServices.value.find((service: BankingService) => service.id === values.service),
    }
    data.value = await updateServiceDefinition(serviceDefinitionId.value, newValues); // Call your API function to fetch profile
      navigateTo(`/serviceDefinitions/${data.value.id}`);
    toast({
      title: "Service Definition Created",
      description: "Service Definition created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new service definition:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

onMounted(() => {
  fetchServiceDefinitions();
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      console.log("newActiveTab: ", newActiveTab);
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    if (newActiveTab == "serviceDefinitionDetails" || newActiveTab == "serviceDefinitionPermissions" || newActiveTab == "serviceDefinitionRoles" || newActiveTab == "serviceDefinitionRoleDetails" || newActiveTab == "newServiceDefinitionRole") {
      fetchServiceDefinitions();
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
  <UiPermissionGuard :permission=PermissionConstants.READ_SERVICE_DEFINITION >
        <UiTabsTrigger
          value="serviceDefinitionDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinitionDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Service Definition Details
        </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_SERVICE_DEFINITION_PERMISSION >
        <UiTabsTrigger
          value="serviceDefinitionPermissions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinitionPermissions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Service Definition Permissions
        </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_SERVICE_DEFINITION_ROLE >
        <UiTabsTrigger
          value="serviceDefinitionRoles"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinitionRoles',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Service Definition Roles
        </UiTabsTrigger>
        <UiTabsTrigger
          value="serviceDefinitionRoleDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinitionRoleDetails',
              },
            })
          "
          :class="{
            hidden: openItems != 'serviceDefinitionRoleDetails'
          }"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Service Definition Role Details
        </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.CREATE_SERVICE_DEFINITION_ROLES >
        <UiTabsTrigger
          value="newServiceDefinitionRole"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newServiceDefinitionRole',
              },
            })
          "
          :class="{
            hidden: openItems != 'newServiceDefinitionRole'
          }"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Service Definition Role
        </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>
      <UiTabsContent
        value="serviceDefinitionDetails"
        class="text-base bg-background rounded-lg"
      >
    <UiCard class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="id">
            <FormItem>
              <FormLabel>Service Definition Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter service definition Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Service Definition Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter service definition Name"
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
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Service Definition Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter service definition Description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel> Service Definition Status </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service definition status" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(ServiceDefinitionStatus)"
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
            <FormField v-slot="{ componentField }" name="service">
              <FormItem>
                <FormLabel> Banking Services </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in bankingServices"
                        :value="item.id"
                      >
                        {{ item.serviceName }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
          <FormField v-slot="{ componentField }" name="defaultGroup">
            <FormItem>
              <FormLabel>Service Definition Default Role </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter service definition Default Group"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfFeatures">
            <FormItem>
              <FormLabel>Service Definition Number Of Features </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  disabled
                  placeholder="Enter service definition Number Of Features"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfActiveRoles">
            <FormItem>
              <FormLabel>Service Definition Number Of Active Roles </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  disabled
                  placeholder="Enter service definition Number Of Active Roles"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfRoles">
            <FormItem>
              <FormLabel>Service Definition Number Of Roles </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  disabled
                  placeholder="Enter service definition Number Of Roles"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfContracts">
            <FormItem>
              <FormLabel>Service Definition Number Of Contracts </FormLabel>
              <FormControl>
                <UiInput
                  type="number"
                  disabled
                  placeholder="Enter service definition Number Of Contracts"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
      
            <UiPermissionGuard :permission="PermissionConstants.UPDATE_SERVICE_DEFINITIONS" >
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

    </UiTabsContent>
    <UiPermissionGuard :permission=PermissionConstants.READ_SERVICE_DEFINITION_PERMISSION >
    <UiTabsContent
    value="serviceDefinitionPermissions"
    class="text-base bg-background rounded-lg"
    >
    <ServiceDefinitionsPermissions />
    </UiTabsContent>
    </UiPermissionGuard>
    <UiPermissionGuard :permission=PermissionConstants.READ_SERVICE_DEFINITION_ROLE >
    <UiTabsContent
    value="serviceDefinitionRoles"
    class="text-base bg-background rounded-lg"
    >
    <ServiceDefinitionsRoles :serviceDefinitionProps="data" />
    </UiTabsContent>
    <UiTabsContent
    value="serviceDefinitionRoleDetails"
    class="text-base bg-background rounded-lg"
    >
    <ServiceDefinitionsRolesDetails :serviceDefinitionProps="data" />
    </UiTabsContent>
    </UiPermissionGuard>
    <UiPermissionGuard :permission=PermissionConstants.CREATE_SERVICE_DEFINITION_ROLES >
    <UiTabsContent
    value="newServiceDefinitionRole"
    class="text-base bg-background rounded-lg"
    >
    <ServiceDefinitionsRolesNew :serviceDefinitionProps="data" />
    </UiTabsContent>
    </UiPermissionGuard>
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
