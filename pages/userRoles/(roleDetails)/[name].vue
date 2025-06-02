<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useToast } from "~/components/ui/toast";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { RoleScope } from "~/global-types";
import type { Role, Permission } from "~/types";
import { systemRolesFormSchema } from "~/validations/systemRolesFormSchema";

const { toast } = useToast();

const topAccordionItem = ref("item-1");
const {
  getRolePermissions,
  updateRolePermissions,
  updateRoleStatus,
  isLoading,
  isUpdating,
} = useRoles();
const { getAuthorities } = useAuth();
const loading = ref(isLoading.value);
const updating = ref(isLoading.value);
const isError = ref(false);
const data = ref<Role | null>(null);
const route = useRoute();
const name: string = route.params.name as string;

interface FormValues {
  name: string;
  description?: string;
  enforce2fa?: boolean;
  disabled: boolean;
}

const badgeBg = (status: string | boolean) => {
  if (
    status == "Active" ||
    status == "Enabled" ||
    status == "true" ||
    status == true
  ) {
    return "bg-green-600 ";
  } else if (status == "New") {
    return "bg-blue-500 ";
  } else if (
    status == "Locked" ||
    status == "Disabled" ||
    status == "InActive" ||
    status == "false" ||
    status == false
  ) {
    return "bg-red-500 ";
  } else if (status == "processing") {
    ("bg-yellow-500 ");
  } else if (status == "UnEnrolled") {
    ("bg-blue-500 ");
  } else if (status == "Suspended") {
    ("bg-orange-700 ");
  } else {
    ("");
  }
};

const groupedPermissions = () => {
  if (!data.value || !data.value?.permissionUsageData) {
    return {};
  }
  return data.value.permissionUsageData.reduce(
    (groups: Record<string, Permission[]>, permission: Permission) => {
      if (!groups[permission.grouping]) {
        groups[permission.grouping] = [];
      }
      groups[permission.grouping].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>
  );
};

const form = useForm<FormValues>({
  validationSchema: systemRolesFormSchema,
});

const refetch = async () => {
  try {
    loading.value = true;
    const fetchedData = await getRolePermissions(name); // Call your API function to fetch roles
    if (fetchedData) {
      data.value = fetchedData;
      const formValues: { [key: string]: any } = {
        name: fetchedData.name,
        description: fetchedData.description,
        enforce2fa: fetchedData.enforce2fa,
        enabled: fetchedData.enabled,
      };

      // Transform permissionUsageData into individual fields
      fetchedData.permissionUsageData?.forEach((permission) => {
        formValues[`${permission.code}`] = permission.selected || false;
      });

      // Initialize group switches based on fetched data
      Object.keys(groupedPermissions()).forEach((groupName) => {
        const permissions = groupedPermissions()[groupName];
        let allSelected = true;

        permissions.forEach((permission) => {
          if (!permission.selected) {
            allSelected = false;
          }
        });

        formValues[groupName] = allSelected;
      });

      form.setValues(formValues);
    }
  } catch (err) {
    console.error("Error fetching roles::-", err);
    console.log(
      "Error fetching roles (stringified)",
      JSON.stringify(err, null, 2)
    );

    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

try {
  loading.value = true;
  const fetchedData = await getRolePermissions(name); // Call your API function to fetch roles
  if (fetchedData) {
    data.value = fetchedData;
    const formValues: { [key: string]: any } = {
      name: fetchedData.name,
      description: fetchedData.description,
      enforce2fa: fetchedData.enforce2fa,
      enabled: fetchedData.enabled,
      scope: fetchedData.scope,
    };

    // Transform permissionUsageData into individual fields
    fetchedData.permissionUsageData?.forEach((permission) => {
      formValues[`${permission.code}`] = permission.selected || false;
    });

    // Initialize group switches based on fetched data
    Object.keys(groupedPermissions()).forEach((groupName) => {
      const permissions = groupedPermissions()[groupName];
      let allSelected = true;

      permissions.forEach((permission) => {
        if (!permission.selected) {
          allSelected = false;
        }
      });

      formValues[groupName] = allSelected;
    });

    form.setValues(formValues);
  }
} catch (err) {
  console.error("Error fetching roles:", err);
  toast({
    title: "Uh oh! Something went wrong.",
    description: `There was a problem with your request: ${err}`,
    variant: "destructive",
  });
  isError.value = true;
} finally {
  loading.value = false;
  isLoading.value = false;
}

const toggleGroup = (groupName: string, value: boolean) => {
  const permissions = groupedPermissions()[groupName];
  permissions.forEach((permission) => {
    form.setFieldValue(permission.code as keyof FormValues, value);
  });
};

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  const updatedPermissions =
    data.value?.permissionUsageData?.reduce(
      (acc: Record<string, boolean>, permission: Permission) => {
        if (values[permission.code] != undefined) {
          acc[permission.code] = values[permission.code];
        } else if (
          data.value?.permissionUsageData?.find(
            (p) => p.code === permission.code
          )?.selected != undefined
        ) {
          acc[permission.code] =
            data.value?.permissionUsageData?.find(
              (p) => p.code === permission.code
            )?.selected || false;
        }
        return acc;
      },
      {}
    ) || {};

  const updatedRoleData = {
    permissions: updatedPermissions,
    ...values
  };

  try {
    isUpdating.value = true;
    updating.value = true;
    await updateRolePermissions(name, updatedRoleData); // Call your API function to fetch roles
    // await getAuthorities()
    toast({
      title: "Role permissions updated successfully.",
    });
  } catch (err: any) {
    console.error("Error updating role permissions:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });
    await refetch();
    isError.value = true;
  } finally {
    isUpdating.value = false;
    updating.value = false;
  }
});

const updadateRoleStatus = async (status: boolean) => {
  try {
    isUpdating.value = true;
    updating.value = true;
    await updateRoleStatus(name, status); // Call your API function to fetch roles
    await getAuthorities()
    toast({
      title: "Role status updated successfully.",
    });
    await refetch();
  } catch (err: any) {
    console.error("Error updating role status:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    isUpdating.value = false;
    updating.value = false;
  }
};
</script>

<template>
  <form @submit="onSubmit">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <div v-else-if="data" class="flex flex-col gap-4 items-center">
      <!-- <UiButton class="pr-5 w-fit self-end" variant="outline">
        <Icon
          name="material-symbols:edit-outline"
          class="w-5 h-5 mr-2 fill-black"
        />
        Edit</UiButton
      > -->
      <UiCard class="w-full p-6">
        <UiAccordion type="single" :default-value="topAccordionItem" collapsible>
          <UiAccordionItem value="item-1">
            <div class="flex justify-between items-center">
              <UiAccordionTrigger class="md:text-lg gap-2">
                <p class="mr-auto">{{ data?.name }}</p></UiAccordionTrigger
              >

              <div class="flex items-center gap-4">
                <UiPermissionGuard permission="UPDATE_ROLE" >
                <UiBadge
                  class="font-bold px-2 py-1"
                  >{{data.enabled ? "Enabled":"Disabled"}}</UiBadge
                >
                <FormField v-slot="{ value, handleChange }" name="enabled">
                  <FormItem>
                    <FormControl>
                      <UiSwitch
                      class="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        :checked="value"
                        @update:checked="handleChange"
                        @click="updadateRoleStatus(value)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                </UiPermissionGuard>
              </div>
            </div>

            <UiAccordionContent class="w-full">
              <div class="grid grid-cols-1 rounded-xl gap-2 w-full p-6 border">
                <div class="grid grid-cols-2 gap-2 items-center">
                  <FormField v-slot="{ value, handleChange }" name="enforce2fa">
                    <FormItem>
                      <FormLabel> Enforce 2fa</FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="value"
                          @update:checked="handleChange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="scope">
                    <FormItem>
                      <FormLabel> Scope </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl class="min-w-[180px]">
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select a scope" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem
                              v-for="item in Object.values(RoleScope)"
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
                </div>
                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel> Description</FormLabel>
                    <FormControl class="w-full">
                      <UiTextarea
                        type="text"
                        placeholder="description"
                        v-bind="componentField"
                        aria-autocomplete="description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </UiCard>

      <UiCard class="w-full p-6">
        <UiTabs default-value="permissions" class="md:space-y-4 w-full">
          <UiTabsList
            class="flex bg-background justify-start py-7 px-0 border-[1px]"
          >
            <UiTabsTrigger
              value="permissions"
              class="md:text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"
            >
              Permissions
            </UiTabsTrigger>
          </UiTabsList>

          <UiTabsContent
            value="permissions"
            class="space-y-4 text-sm md:text-base"
          >
                <UiAccordion
                  type="multiple"
                  class="border-none space-y-2"
                  :default-value="[Object.keys(groupedPermissions())[0]]"
                  collapsible
                >
                  <template
                    v-for="(permissions, grouping) in groupedPermissions()"
                    :key="grouping"
                  >
                    <UiAccordionItem
                      class="border-none "
                      :value="grouping.toString()"
                    >
                      <div
                        class="flex justify-between items-center bg-secondary rounded-lg px-4"
                      >
                        <UiAccordionTrigger
                          class="md:text-base gap-2 flex-row-reverse"
                        >
                          <p class="mr-auto">
                            Grouping:
                            {{ grouping }}
                            <span
                              class="text-muted-foreground uppercase text-sm"
                            >
                              -
                              {{ permissions.length }} Permissions
                            </span>
                          </p>
                        </UiAccordionTrigger>

                        <FormField
                          v-slot="{ value, handleChange }"
                          :name="`${grouping}`"
                        >
                          <FormItem>
                            <FormControl>
                              <UiCheckbox
                                :checked="value"
                                @update:checked="
                                  ($event) => {
                                    handleChange(!value);
                                    toggleGroup(grouping, $event);
                                  }
                                "
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>

                      <UiAccordionContent class="w-full border border-t-0 mt-2 rounded-lg">
                          <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 px-4 py-2"
                          >
                            <div
                              v-for="permission in permissions"
                              :key="permission.code"
                              class="flex items-center py-2 hover:bg-muted/50"
                            >
                              <!-- <div class="flex border gap-4 items-start"> -->
                                <FormField
                                  v-slot="{ value, handleChange }"
                                  :name="`${permission.code}`"
                                >
                                <FormItem className="flex flex-row w-full items-start gap-x-3">                                   
                                   <FormLabel class="self-center text-xs">{{ permission.code }}</FormLabel>
                                    <FormControl> 
                                      <UiCheckbox
                                        :checked="value"
                                        class="order-first self-center"
                                        :default-checked="permission.selected"
                                        @update:checked="handleChange"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                </FormField>
                                <!-- <div>{{ permission.code }}</div> -->
                              <!-- </div> -->
                              <!-- <p class="text-sm text-muted-foreground">{{ permission.description }}</p> -->
                            </div>
                          </div>
                      </UiAccordionContent>
                    </UiAccordionItem>
                  </template>
                </UiAccordion>
                <UiPermissionGuard permission="UPDATE_ROLE" >
            <div class="w-full flex justify-end">
              <UiButton :disabled="isUpdating" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isUpdating"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>
                Update</UiButton
              >
            </div>
          </UiPermissionGuard>
          </UiTabsContent>
        </UiTabs>
      </UiCard>
    </div>
    <div v-else>No data found.</div>
    <div v-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </form>
</template>

<style lang="css" scoped></style>
