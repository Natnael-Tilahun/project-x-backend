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
import { newServiceDefinitionRoleFormSchema } from "~/validations/newServiceDefinitionRoleFormSchema";
import type { ServiceDefinition, ServiceDefinitionRole, Role, Permission } from "~/types";

const { createNewServiceDefinitionRole, isLoading } = useServiceDefinitionsRoles();

const serviceDefinitionPermissionsData = ref<Permission[]>([]);
  const selectedPermissions = ref<Permission[]>([]);
const isError = ref(false);
const data = ref<ServiceDefinitionRole>();
const isSubmitting = ref(false);
const serviceDefinition = ref<ServiceDefinition>();
const route = useRoute();

const props = defineProps<{
  serviceDefinitionProps?: ServiceDefinition;
}>();

if (props?.serviceDefinitionProps) {
  serviceDefinition.value = props?.serviceDefinitionProps;
  serviceDefinitionPermissionsData.value = serviceDefinition.value.permissions || []
}
const form = useForm({
  validationSchema: newServiceDefinitionRoleFormSchema,
});



const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      permissions: selectedPermissions.value,
      serviceDefinition: serviceDefinition.value,
    }
    data.value = await createNewServiceDefinitionRole(newValues); // Call your API function to fetch profile
    navigateTo({
    path: route.path,
    query: {
      activeTab: 'serviceDefinitionRoleDetails',
      serviceDefinitionRoleId: data.value?.id,
    },
  })
    toast({
      title: "Service Definition Role Created",
      description: "Service Definition Role created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new service definition role:", err.message);
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
  <div class="w-full h-full flex flex-col gap-8 p-6">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Service Definition Role</h1>
      <p class="text-sm text-muted-foreground">
        Create new service definition role by including service definition, role, and permissions
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid gap-6">
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
                        <UiCommandEmpty>
                          <div class="text-sm text-muted-foreground p-6">
                            <p>No permissions found.</p>
                            <p>
                              Please select a service definition. If you have
                              selected a service definition, please check your
                              permissions.
                            </p>
                          </div>
                        </UiCommandEmpty>
                        <UiCommandGroup>
                          <UiCommandItem
                            v-for="permission in serviceDefinitionPermissionsData"
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
                                    (permission: Permission) => permission.code
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
