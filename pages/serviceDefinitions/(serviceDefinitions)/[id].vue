<script lang="ts" setup>
const openItems = ref(["item-1"]);

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
import { ServiceType, ServiceDefinitionStatus } from "@/global-types";

const route = useRoute();
const { getServiceDefinitionById, updateServiceDefinition, isLoading, isSubmitting } =
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
const permissionsData = ref<Permission[]>([]);
const bankingServices = ref<BankingService[]>([]);
const selectedPermissions = ref<Permission[]>([]);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
serviceDefinitionId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newServiceDefinitionFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
    data.value = await getServiceDefinitionById(serviceDefinitionId.value);
  console.log("data: ", data.value);
  const permissions = await getPermissions();
  permissionsData.value = permissions.sort((a: Permission, b: Permission) =>
      a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
    );
      console.log("permissions: ", permissionsData.value);
  bankingServices.value = await getBankingServices();
  console.log("bankingServices: ", bankingServices.value);
  let a = {
        ...data.value,
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching service definition:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      service: bankingServices.value.find((service: BankingService) => service.id === values.service),
    }
    console.log("values: ", newValues);
    data.value = await updateServiceDefinition(serviceDefinitionId.value, newValues); // Call your API function to fetch profile
      navigateTo(`/serviceDefinitions/${data.value.id}`);
    console.log("New Service Definition data; ", data.value);
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
          <FormField v-slot="{ componentField }" name="defaultGroup">
            <FormItem>
              <FormLabel>Service Definition Default Group </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
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
                  placeholder="Enter service definition Number Of Contracts"
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
                <FormLabel> Service </FormLabel>
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No contract found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
