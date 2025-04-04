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
import { newServiceDefinitionFormSchema } from "~/validations/newServiceDefinitionFormSchema";
import { ServiceType, ServiceDefinitionStatus } from "@/global-types";
import type { ServiceDefinition, Permission, BankingService } from "~/types";

const { createNewServiceDefinition, isLoading } = useServiceDefinitions();
const { getPermissions } = usePermissions();
const { getBankingServices } = useBankingServices();
const permissionsData = ref<Permission[]>([]);
const services = ref<BankingService[]>([]);
const selectedPermissions = ref<Permission[]>([]);
const isError = ref(false);
const data = ref<ServiceDefinition>();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newServiceDefinitionFormSchema,
});

const fetchData = async () => {
  try {
    const permissions = await getPermissions(0,100000);
    permissionsData.value = permissions.sort((a: Permission, b: Permission) =>
      a?.code?.toLowerCase().localeCompare(b?.code?.toLowerCase())
    );
    console.log("permissions: ", permissionsData.value);
    const bankingServices = await getBankingServices();
    services.value = bankingServices;
  } catch (err) {
    console.error("Error fetching permissions:", err);
    isError.value = true;
  } 
};

await useAsyncData("permissionsData", async () => {
  await fetchData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      service: services.value.find((service: BankingService) => service.id === values.service),
    }
    data.value = await createNewServiceDefinition(newValues); // Call your API function to fetch profile
    navigateTo(`/serviceDefinitionsRolesDetails/${data.value?.id}`);
    toast({
      title: "Service Definition Created",
      description: "Service Definition created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new service definition:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Service Definition</h1>
      <p class="text-sm text-muted-foreground">
        Create new service definition by including name, service type, permissions, and
        service definition
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter service definition name"
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
                <FormLabel>Description </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter service definition description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="defaultGroup">
              <FormItem>
                <FormLabel>Default Group </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default group"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="numberOfFeatures">
              <FormItem>
                <FormLabel>Number of Features </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter number of features"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="numberOfActiveRoles">
              <FormItem>
                <FormLabel>Number of Active Roles </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter number of active roles"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="numberOfRoles">
              <FormItem>
                <FormLabel>Number of Roles </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter number of roles"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="numberOfContracts">
              <FormItem>
                <FormLabel>Number of Contracts </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter number of contracts"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel> Status </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a status" />
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
                <FormLabel>Banking Services </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in services"
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
