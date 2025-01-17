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

const { toast } = useToast();

const openItems = ref(["item-1"]);
const { getRolePermissions, updateRolePermissions, isLoading, isUpdating } =
  useRoles();
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
  // validationSchema: rolesFormSchema,
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
        disabled: !fetchedData.disabled,
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
      disabled: !fetchedData.disabled,
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
  };

  try {
    isUpdating.value = true;
    updating.value = true;
    await updateRolePermissions(name, updatedRoleData); // Call your API function to fetch roles
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
</script>

<template>
  <form @submit="onSubmit">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <div v-else-if="data" class="flex flex-col gap-8 items-center">
      <!-- <UiButton class="pr-5 w-fit self-end" variant="outline">
        <Icon
          name="material-symbols:edit-outline"
          class="w-5 h-5 mr-2 fill-black"
        />
        Edit</UiButton
      > -->
      <UiCard class="w-full p-6">
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem value="item-1">
            <div class="flex justify-between items-center">
              <UiAccordionTrigger class="md:text-lg gap-2">
                <p class="mr-auto">{{ data?.name }}</p></UiAccordionTrigger
              >

              <!-- <FormField v-slot="{ value, handleChange }" name="disabled">
                <FormItem>
                  <FormControl>
                    <UiSwitch
                      disabled=""
                      :checked="value"
                      @update:checked="handleChange"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField> -->
              <UiBadge :class="badgeBg(!data.disabled)">{{
                !data.disabled ? "Enabled" : "Disabled"
              }}</UiBadge>
            </div>

            <UiAccordionContent class="w-full" v-model="openItems">
              <div class="grid grid-cols- rounded-xl gap-5 w-full p-6 border">
                <FormField v-slot="{ value, handleChange }" name="enforce2fa">
                  <FormItem>
                    <FormLabel> Enforce 2fa</FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        disabled
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel> Description</FormLabel>
                    <FormControl class="w-full">
                      <UiTextarea
                        type="text"
                        disabled
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
            <div class="flex flex-col md:gap-4 w-full">
              <div class="flex flex-col space-y-6">
                <UiAccordion
                  type="single"
                  :default-value="Object.keys(groupedPermissions())[0]"
                  collapsible
                >
                  <template
                    v-for="(permissions, grouping) in groupedPermissions()"
                    :key="grouping"
                  >
                    <UiAccordionItem
                      class="mb-5 border-none"
                      :value="grouping.toString()"
                    >
                      <div
                        class="flex justify-between items-center bg-secondary rounded-lg px-4"
                      >
                        <UiAccordionTrigger
                          class="md:text-lg gap-2 flex-row-reverse"
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
                              <UiSwitch
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

                      <UiAccordionContent class="w-full" v-model="openItems">
                        <div class="flex flex-col gap-2 w-full justify-between">
                          <div
                            class="space-y-1 border-b"
                            v-for="permission in permissions"
                            :key="permission.code"
                          >
                            <div
                              class="flex lg:grid-cols-3 gap-4 md:gap-8 w-full justify-between px-10 py-4"
                            >
                              <div class="space-y-4">
                                <div class="flex flex-col">
                                  <h1 class="text-muted-foreground">Code</h1>
                                  <p>{{ permission.code }}</p>
                                </div>

                                <div class="flex flex-col">
                                  <h1 class="text-muted-foreground">
                                    Description
                                  </h1>
                                  <p>{{ permission.description }}</p>
                                </div>

                                <div>{{ permission.selected }}</div>
                              </div>
                              <FormField
                                v-slot="{ value, handleChange }"
                                :name="`${permission.code}`"
                              >
                                <FormItem>
                                  <FormLabel>Selected</FormLabel>
                                  <FormControl>
                                    <UiSwitch
                                      :checked="value"
                                      :default-checked="permission.selected"
                                      @update:checked="handleChange"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </FormField>
                            </div>
                          </div>
                        </div>
                      </UiAccordionContent>
                    </UiAccordionItem>
                  </template>
                </UiAccordion>
              </div>
            </div>
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
