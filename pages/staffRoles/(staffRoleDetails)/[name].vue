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
import { rolesFormSchema } from "~/validations/rolesFormSchema";
import { PermissionConstants } from "~/constants/permissions";
import { computed, ref } from "vue";

const { toast } = useToast();

const topAccordionItem = ref("item-1");
const {
  getStaffRolePermissions,
  updateStaffRole,
  updateStaffRoleStatus,
  createStaffRolePermissions,
  deleteStaffRolePermissions,
  isUpdating,
} = useStaffRoles();
const { getAuthorities } = useAuth();
const loading = ref(false);
const updating = ref(false);
const isError = ref(false);
const data = ref<Role | null>(null);
const route = useRoute();
const name: string = route.params.name as string;
const addLoading = ref(false);
const deleteLoading = ref(false);
const openDeletePermissionModal = ref(false);
const setOpenDeletePermissionModal = (value: boolean) => {
  openDeletePermissionModal.value = value;
};

const openAddPermissionModal = ref(false);
const setOpenAddPermissionModal = (value: boolean) => {
  openAddPermissionModal.value = value;
};

interface FormValues {
  name: string;
  description?: string;
  enforce2fa?: boolean;
  disabled: boolean;
}

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

const groupedAllPermissionsSorted = computed(() => {
  const groups = groupedPermissions();
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
});

const groupedSelectedPermissionsSorted = computed(() => {
  if (!data.value || !data.value?.permissionUsageData) return [];
  const groups = data.value.permissionUsageData
    .filter((p) => p.selected)
    .reduce((acc: Record<string, Permission[]>, permission: Permission) => {
      if (!acc[permission.grouping]) acc[permission.grouping] = [];
      acc[permission.grouping].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
});

const form = useForm<FormValues>({
  validationSchema: rolesFormSchema,
});

const refetch = async () => {
  isError.value = false
  await fetchStaffRoleData()
};

onMounted(() => {
  fetchStaffRoleData();
});


const fetchStaffRoleData = async () => {
try {
  loading.value = true;
  const fetchedData = await getStaffRolePermissions(name); // Call your API function to fetch roles
  if (fetchedData) {
    data.value = fetchedData;
    const formValues: { [key: string]: any } = {
      name: fetchedData.name,
      description: fetchedData.description,
      enforce2fa: fetchedData.enforce2fa || false,
      enabled: fetchedData.enabled || false,
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
}
}

const onSubmit = form.handleSubmit(async (values: any) => {
  loading.value = true;
  const updatedPermissions =
    data.value?.permissionUsageData?.reduce(
      (acc: Record<string, boolean>, permission: Permission) => {
        if (form.values[permission.code] != undefined) {
          acc[permission.code] = form.values[permission.code];
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
    name: values.name,
    description: values.description,
    enforce2fa: values.enforce2fa,
    enabled: values.enabled,
    // permissions: updatedPermissions,
    scope: RoleScope.ORGANIZATIONAL,
  };

  try {
    isUpdating.value = true;
    updating.value = true;
    await updateStaffRole(name, updatedRoleData);
    toast({
      title: "Role updated successfully.",
    });
  } catch (err: any) {
    console.error("Error updating role:", err);
    // toast({
    //   title: "Uh oh! Something went wrong.",
    //   description: `There was a problem with your request: ${err}`,
    //   variant: "destructive",
    // });
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
    await updateStaffRoleStatus(name, status); // Call your API function to fetch roles
    await getAuthorities();
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

// Track selected permissions for add/remove
const selectedToAdd = ref<string[]>([]);
const selectedToDelete = ref<string[]>([]);

// All permission codes currently selected for this role
const selectedPermissionCodes = computed(
  () =>
    data.value?.permissionUsageData
      ?.filter((p) => p.selected)
      .map((p) => p.code) || []
);

// Grouped permissions for all (left column)
const groupedAllPermissions = computed(() => groupedPermissions());

// Grouped permissions for selected (right column)
const groupedSelectedPermissions = computed(() => {
  if (!data.value || !data.value?.permissionUsageData) return {};
  return data.value.permissionUsageData
    .filter((p) => p.selected)
    .reduce((groups: Record<string, Permission[]>, permission: Permission) => {
      if (!groups[permission.grouping]) groups[permission.grouping] = [];
      groups[permission.grouping].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
});

// Add selected permissions
const addSelectedPermissions = async () => {
  if (!selectedToAdd.value.length) return;
  addLoading.value = true;
  try {
    isUpdating.value = true;
    await createStaffRolePermissions(name, {
      permissionCodes: selectedToAdd.value,
    });
    toast({
      title: "Permissions Added",
      description: "Selected permissions have been added.",
    });
    await refetch();
    selectedToAdd.value = [];
    setOpenAddPermissionModal(false)
  } catch (err) {
    isError.value = true;
    toast({
      title: "Error",
      description: "Failed to add permissions.",
      variant: "destructive",
    });
  } finally {
    isUpdating.value = false;
    addLoading.value = false;
  }
};

// Delete selected permissions
const deleteSelectedPermissions = async () => {
  if (!selectedToDelete.value.length) return;
  deleteLoading.value = true;
  try {
    isUpdating.value = true;
    await deleteStaffRolePermissions(name, {
      permissionCodes: selectedToDelete.value,
    });
    toast({
      title: "Permissions Deleted",
      description: "Selected permissions have been removed.",
    });
    await refetch();
    selectedToDelete.value = [];
    setOpenDeletePermissionModal(false)
  } catch (err) {
    isError.value = true;
    toast({
      title: "Error",
      description: "Failed to delete permissions.",
      variant: "destructive",
    });
  } finally {
    isUpdating.value = false;
    deleteLoading.value = false;
  }
};

// Helper: All available permissions that are not already selected
const availablePermissionCodes = computed(() => {
  if (!data.value || !data.value.permissionUsageData) return [];
  return data.value.permissionUsageData
    .filter((p) => !selectedPermissionCodes.value.includes(p.code))
    .map((p) => p.code);
});

// Select all available permissions
function selectAllAvailable() {
  selectedToAdd.value = [...availablePermissionCodes.value];
}

// Unselect all available permissions
function unselectAllAvailable() {
  selectedToAdd.value = [];
}

// Select all permissions in the right column (selected permissions)
function selectAllSelected() {
  if (!data.value || !data.value.permissionUsageData) return;
  selectedToDelete.value = data.value.permissionUsageData
    .filter((p) => p.selected)
    .map((p) => p.code);
}

// Unselect all permissions in the right column
function unselectAllSelected() {
  selectedToDelete.value = [];
}
</script>

<template>
  <form @submit="onSubmit">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <div v-else-if="data && !isError" class="flex flex-col gap-4 items-center">
      <UiCard class="w-full p-6">
        <UiAccordion
          type="single"
          :default-value="topAccordionItem"
          collapsible
        >
          <UiAccordionItem value="item-1">
            <div class="flex justify-between items-center">
              <UiAccordionTrigger class="md:text-lg gap-2">
                <p class="mr-auto">{{ data?.name }}</p></UiAccordionTrigger
              >

              <div
                class="flex items-center gap-4 border pb-1 pt-2 px-3 rounded-md"
              >
                <UiPermissionGuard
                  :permission="
                    data.enabled
                      ? PermissionConstants.DISABLE_STAFF_ROLE
                      : PermissionConstants.ENABLE_STAFF_ROLE
                  "
                >
                  <UiBadge
                    class="font-bold px-2 py-1 mb-1"
                    :class="data.enabled ? 'bg-green-500' : 'bg-red-500'"
                    >{{ data.enabled ? "Enabled" : "Disabled" }}</UiBadge
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
                <UiPermissionGuard :permission=PermissionConstants.UPDATE_STAFF_ROLE_PERMISSION >
            <div class="w-full flex justify-end mt-4">
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
            <div class="flex gap-8 h-full w-full">
              <!-- Left: All Permissions (Available) -->
              <div class="w-full min-h-min flex flex-col">
                <div class="flex justify-between items-center mb-2">
                  <h3 class="font-semibold">Available Permissions</h3>
                  <p class="text-sm text-muted-foreground ">
                    {{ selectedToAdd.length }} of {{ availablePermissionCodes.length }} selected
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    type="button"
                    @click="selectAllAvailable"
                    :disabled="!data?.permissionUsageData?.filter((p) => !selectedPermissionCodes.includes(p.code)).length"
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    type="button"
                    @click="unselectAllAvailable"
                    :disabled="!selectedToAdd.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiPermissionGuard :permission="PermissionConstants.CREATE_STAFF_ROLE_PERMISSION" >
                    <UiButton
                    type="button"
                      class="ml-auto w-fit bg-green-600"
                      :disabled="selectedToAdd.length === 0 || addLoading"
                    @click="setOpenAddPermissionModal(true)"
                  >
                    <Icon
                      name="material-symbols:add"
                      v-if="addLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    <Icon
                      name="heroicons:plus-circle"
                      v-if="!addLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="addLoading"
                      :disabled="addLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Add
                    {{
                      selectedToAdd.length ? `(${selectedToAdd.length})` : ""
                    }}
                  </UiButton>
                  </UiPermissionGuard>
                </div>
                <UiAccordion type="single" class="border-none space-y-2" collapsible>
                  <template v-for="[grouping, permissions] in groupedAllPermissionsSorted" :key="grouping">
                    <UiAccordionItem :value="grouping" class="border-none p-0" >
                      <div class="flex justify-between items-center bg-secondary rounded-lg px-4 m-0">
                          <UiAccordionTrigger class="md:text-base gap-2 flex-row-reverse">
                            <div class="font-medium text-sm m-0">{{ grouping }}</div>
                          </UiAccordionTrigger>
                        <!-- Group Checkbox for Add -->
                        <UiCheckbox
                        :checked="permissions.every(p => selectedToAdd.includes(p.code))"
                        :indeterminate="permissions.some(p => selectedToAdd.includes(p.code)) && !permissions.every(p => selectedToAdd.includes(p.code))"
                        @update:checked="checked => {
                          if (checked) {
                            permissions.forEach(p => {
                              if (!selectedToAdd.includes(p.code) && !selectedPermissionCodes.includes(p.code)) {
                                selectedToAdd.push(p.code);
                              }
                            });
                          } else {
                            permissions.forEach(p => {
                              selectedToAdd = selectedToAdd.filter(code => code !== p.code);
                            });
                          }
                        }"
                        :disabled="permissions.every(p => selectedPermissionCodes.includes(p.code))"
                        />
                      </div>
                      <UiAccordionContent class="p-0 m-0">
                        <UiCard class="p-2 grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-x-8 px-2 py-2 m-0">
                            <div
                              v-for="permission in permissions"
                              :key="permission.code"
                              class="flex items-center py-2 px-2 hover:bg-muted/50"
                            >
                            <FormField
                              v-slot="{ value, handleChange }"
                              :name="`${permission.code}`"
                            >
                   
                                  <FormItem className="flex flex-row w-full items-start gap-x-3">                                   
                                   <FormLabel       :class="{
                          'text-gray-400': selectedPermissionCodes.includes(
                            permission.code
                          ),
                        }"
                         class="self-center text-xs">{{ permission.code }}</FormLabel>
                                    <FormControl> 
                                  <UiCheckbox
                                    class="order-first self-center"
                                    :checked="selectedToAdd.includes(permission.code)"
                                    :disabled="selectedPermissionCodes.includes(permission.code)"
                                    @update:checked="
                                      (checked) => {
                                        if (checked) selectedToAdd.push(permission.code);
                                        else
                                          selectedToAdd = selectedToAdd.filter(
                                            (code) => code !== permission.code
                                          );
                                      }
                                    "
                                  />
                                </FormControl>
                              </FormItem>
                            </FormField>
                          </div>
                        </UiCard>
                      </UiAccordionContent>
                    </UiAccordionItem>
                  </template>
                </UiAccordion>
                <UiPermissionGuard :permission="PermissionConstants.CREATE_STAFF_ROLE_PERMISSION" >
                <UiButton
                type="button"
                  class="mt-2 w-full bg-green-600"
                  :disabled="!selectedToAdd.length || isUpdating || addLoading"
                  @click.prevent="setOpenAddPermissionModal(true)"
                >
                <Icon
                      name="material-symbols:add"
                      v-if="addLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    <Icon
                      name="heroicons:plus-circle"
                      v-if="!addLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                  Add
                  {{ selectedToAdd.length ? `(${selectedToAdd.length})` : "" }}
                </UiButton>
                </UiPermissionGuard> 
              </div>

              <!-- Middle: Bi-directional Arrow -->
              <div
                class="flex flex-col items-center justify-center gap-1 p-4 w-fit h-full self-center"
              >
                <Icon
                  name="heroicons:arrow-right"
                  :class="selectedToAdd.length != 0 && 'text-primary'"
                  class="h-10 w-10 text-gray-400"
                />
                <Icon
                  name="heroicons:arrow-left"
                  :class="selectedToDelete.length != 0 && 'text-primary'"
                  class="h-10 w-10 text-gray-400"
                />
              </div>

              <!-- Right: Selected Permissions -->
              <div class="w-full min-h-min flex flex-col">
                <!-- <h3 class="font-semibold mb-2">Selected Permissions</h3> -->
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium">Selected Permissions</p>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedToDelete.length }} of {{ selectedPermissionCodes.length }} selected
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    type="button"
                    size="sm"
                    @click="selectAllSelected"
                    :disabled="!Object.keys(groupedSelectedPermissions).length"
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    type="button"
                    @click="unselectAllSelected"
                    :disabled="!selectedToDelete.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiPermissionGuard :permission="PermissionConstants.DELETE_STAFF_ROLE_PERMISSION" >
                  <UiButton
                  type="button"
                    class="ml-auto w-fit bg-red-600 text-white"
                    :disabled="!selectedToDelete.length || isUpdating || deleteLoading"
                    @click.prevent="setOpenDeletePermissionModal(true)"
                  >
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="deleteLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    <Icon
                      name="heroicons:trash"
                      v-if="!deleteLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    Delete
                    {{ selectedToDelete.length ? `(${selectedToDelete.length})` : "" }}
                  </UiButton>
                  </UiPermissionGuard>
                </div>
                <div class="border-none" v-if="Object.keys(groupedSelectedPermissions).length">
                  <UiAccordion type="single" collapsible class="border-none space-y-2">
                    <template v-for="[grouping, permissions] in groupedSelectedPermissionsSorted" :key="grouping">
                      <UiAccordionItem :value="grouping" class="border-none" >
                        <div class="flex justify-between items-center bg-secondary rounded-lg px-4">
                          <UiAccordionTrigger class="md:text-base gap-2 flex-row-reverse">
                            <div class="font-medium text-sm mb-">{{ grouping }}</div>
                          </UiAccordionTrigger>
                          <!-- Group Checkbox for Delete -->
                          <UiCheckbox
                            :checked="permissions.every(p => selectedToDelete.includes(p.code))"
                            :indeterminate="permissions.some(p => selectedToDelete.includes(p.code)) && !permissions.every(p => selectedToDelete.includes(p.code))"
                            @update:checked="checked => {
                              if (checked) {
                                permissions.forEach(p => {
                                  if (!selectedToDelete.includes(p.code)) {
                                    selectedToDelete.push(p.code);
                                  }
                                });
                              } else {
                                permissions.forEach(p => {
                                  selectedToDelete = selectedToDelete.filter(code => code !== p.code);
                                });
                              }
                            }"
                          />
                        </div>
                        <UiAccordionContent class="p-0 m-0">
                          <UiCard class="p-2 grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-x-8 px-2 py-2 m-0">
                            <div
                              v-for="permission in permissions"
                              :key="permission.code"
                              class="flex items-center py-2 px-2 hover:bg-muted/50"
                            >
                            <FormField
                                  v-slot="{ value, handleChange }"
                                  :name="`${permission.code}`"
                                >
                                <FormItem className="flex flex-row w-full items-start gap-x-3">                                   
                                   <FormLabel class="self-center text-xs">{{ permission.code }}</FormLabel>
                                    <FormControl> 
                              <UiCheckbox
                                class="order-first self-center"
                                :checked="selectedToDelete.includes(permission.code)"
                                @update:checked="
                                  (checked) => {
                                    if (checked)
                                      selectedToDelete.push(permission.code);
                                    else
                                      selectedToDelete =
                                        selectedToDelete.filter(
                                          (code) => code !== permission.code
                                        );
                                  }
                                "
                              />
                              </FormControl>
                              </FormItem>
                              </FormField>
                            </div>
                          </UiCard>
                        </UiAccordionContent>
                      </UiAccordionItem>
                    </template>
                  </UiAccordion>
                  <UiPermissionGuard :permission="PermissionConstants.DELETE_STAFF_ROLE_PERMISSION" >
                  <UiButton
                    type="button"
                    class="mt-2 w-full bg-red-600 text-white"
                    :disabled="!selectedToDelete.length || isUpdating || deleteLoading"
                    @click.prevent="setOpenDeletePermissionModal(true)"
                  >
                  <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="deleteLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    <Icon
                      name="heroicons:trash"
                      v-if="!deleteLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    Delete
                    {{
                      selectedToDelete.length
                        ? `(${selectedToDelete.length})`
                        : ""
                    }}
                  </UiButton>
                  </UiPermissionGuard>
                </div>
                <UiCard v-else class="text-gray-400 py-8 text-center h-full">
                  No selected permissions to remove.
                </UiCard>
              </div>
            </div>
          </UiTabsContent>
        </UiTabs>
      </UiCard>
    </div>
    <div v-else-if="!data && !isError">No data found.</div>
    <div v-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </form>

  <UiAlertDialog :open="openDeletePermissionModal" :onOpenChange="setOpenDeletePermissionModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently remove permissions from this staff role.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeletePermissionModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-red-500" @click="deleteSelectedPermissions()">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="deleteLoading"
            :disabled="deleteLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>

  <UiAlertDialog :open="openAddPermissionModal" :onOpenChange="setOpenAddPermissionModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently add permissions for this staff role.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenAddPermissionModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction class="bg-green-500" @click="addSelectedPermissions()">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="addLoading"
            :disabled="addLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

