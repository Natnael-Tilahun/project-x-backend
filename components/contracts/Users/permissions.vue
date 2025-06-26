<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { toast } from "~/components/ui/toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Permission } from "~/types";

const {
  getContractUserPermissions,
  createContractCoreCustomerUserPermission,
  deleteContractCoreCustomerUserPermission,
  isLoading,
  isSubmitting,
} = useContractsUsers();
const { getContractCoreCustomerAccountPermissions } = useContractsCoreCustomersAccount();

const contractAccountId = ref("");
const userAccountId = ref<string>("");


const props = defineProps<{
  contractAccountIdProps?: string | null;
  userAccountIdProps?:string | null
}>();

if(props.contractAccountIdProps){
  contractAccountId.value = props.contractAccountIdProps
}

if(props.userAccountIdProps){
  userAccountId.value = props.userAccountIdProps
}

console.log("contractAccountId: ", contractAccountId.value)
console.log("userAccountId: ", userAccountId.value)



const selectedPermissions = ref<string[]>([]);
const permissionsData = ref<Permission[]>([]);
const isError = ref(false);
const loading = ref(isLoading.value);

const initialPermissions = ref<string[]>([]);

const fetchContractAccountPermissionsData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const response = (await getContractCoreCustomerAccountPermissions(contractAccountId.value)) || [];
    permissionsData.value = response.sort((a, b) =>
      a?.permissionCode
        .toLowerCase()
        .localeCompare(b?.permissionCode.toLowerCase())
    );
  } catch (err) {
    console.error("Error fetching contract account permissions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const fetchContractUserPermissions = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    const response = await getContractUserPermissions(
      userAccountId.value
    );
    selectedPermissions.value = (
      response?.map((permission: any) => permission.permissionCode) || []
    ).filter(Boolean);
    initialPermissions.value = [...selectedPermissions.value];
  } catch (err) {
    console.error("Error fetching contract user permissions:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchContractAccountPermissionsData();
  await fetchContractUserPermissions();
});

const addLoading = ref(false);
const deleteLoading = ref(false);

const refetch = async () => {
  isError.value = false;
  await fetchContractAccountPermissionsData();
  await fetchContractUserPermissions();
};

const selectedToAdd = ref<string[]>([]);
const selectedToDelete = ref<string[]>([]);

// Add selected permissions from left to right and call backend
const addSelectedPermissions = async () => {
  if (selectedToAdd.value.length === 0) return;
  try {
    addLoading.value = true;
    isSubmitting.value = true;
    await createContractCoreCustomerUserPermission(contractAccountId.value, {
      permissionCodes: selectedToAdd.value,
    });
    toast({
      title: "Permissions Added",
      description: "Selected permissions have been added.",
    });
    await refetch();
    selectedToAdd.value = [];
  } catch (err) {
    isError.value = true;
  } finally {
    addLoading.value = false;
    isSubmitting.value = false;
  }
};

// Delete selected permissions from right column and call backend
const deleteSelectedPermissions = async () => {
  if (selectedToDelete.value.length === 0) return;
  try {
    deleteLoading.value = true;
    isSubmitting.value = true;
    await deleteContractCoreCustomerUserPermission(contractAccountId.value, {
      permissionCodes: selectedToDelete.value,
    });
    toast({
      title: "Permissions Deleted",
      description: "Selected permissions have been removed.",
    });
    await refetch();
    selectedToDelete.value = [];
  } catch (err) {
    isError.value = true;
  } finally {
    deleteLoading.value = false;
    isSubmitting.value = false;
  }
};

// Function to select/unselect all available permissions
const selectAllAvailable = () => {
  selectedToAdd.value = permissionsData.value
    .filter((p) => !selectedPermissions.value.includes(p.permissionCode))
    .map((p) => p.permissionCode);
};
const unselectAllAvailable = () => {
  selectedToAdd.value = [];
};

// Function to select/unselect all assigned permissions
const selectAllAssigned = () => {
  selectedToDelete.value = selectedPermissions.value;
};
const unselectAllAssigned = () => {
  selectedToDelete.value = [];
};
</script>

<template>
  <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2"
        >Contract Core Account Permissions</UiSheetTitle
      >
      <UiSheetDescription class="py-4 space-y-4">
        <UiCard class="flex flex-col gap-6 items-center p-6 h-full">
          <div v-if="loading" class="py-10 flex justify-center w-full">
            <UiLoading />
          </div>
          <div
            v-else-if="permissionsData.length > 0 && !isError"
            class="w-full h-full"
            style="min-height: 400px"
          >
            <div class="flex gap-8 h-full w-full">
              <!-- Left: Available Permissions -->
              <div class="w-full h-full flex flex-col">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium">Available Permissions</p>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedToAdd.length }} of
                    {{
                      permissionsData.filter(
                        (p) => !selectedPermissions.includes(p.permissionCode)
                      ).length
                    }}
                    permissions
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="selectAllAvailable"
                    :disabled="
                      !permissionsData.filter(
                        (p) => !selectedPermissions.includes(p.permissionCode)
                      ).length
                    "
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="unselectAllAvailable"
                    :disabled="!selectedToAdd.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiButton
                    class="ml-auto w-fit bg-green-600"
                    :disabled="selectedToAdd.length === 0 || addLoading"
                    @click="addSelectedPermissions"
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
                </div>
                <UiCard class="px-4 py-2 flex-1 flex flex-col overflow-y-auto">
                  <FormField
                    v-for="permission in permissionsData"
                    :key="permission.permissionCode"
                    :model-value="
                      selectedToAdd.includes(permission.permissionCode)
                    "
                    name="availablePermissions"
                  >
                    <FormItem class="flex items-center gap-2">
                      <FormControl>
                        <UiCheckbox
                          :checked="
                            selectedToAdd.includes(permission.permissionCode)
                          "
                          :disabled="
                            selectedPermissions.includes(
                              permission.permissionCode
                            )
                          "
                          @update:checked="
                            (checked) => {
                              if (checked) {
                                selectedToAdd.push(permission.permissionCode);
                              } else {
                                selectedToAdd = selectedToAdd.filter(
                                  (permissionCode) =>
                                    permissionCode !== permission.permissionCode
                                );
                              }
                            }
                          "
                        />
                      </FormControl>
                      <FormLabel
                        :class="{
                          'text-gray-400': selectedPermissions.includes(
                            permission.permissionCode
                          ),
                        }"
                      >
                        {{ permission.permissionCode }}
                      </FormLabel>
                    </FormItem>
                  </FormField>
                </UiCard>
                <UiButton
                  class="mt-4 w-full bg-green-600"
                  :disabled="selectedToAdd.length === 0 || addLoading"
                  @click="addSelectedPermissions"
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
                  {{ selectedToAdd.length ? `(${selectedToAdd.length})` : "" }}
                </UiButton>
              </div>

              <!-- Middle: Bi-directional Arrow -->
              <div
                class="flex flex-col items-center justify-center gap-2 w-1/2 h-full self-center"
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
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium">Selected Permissions</p>
                  <p class="text-sm text-muted-foreground">
                    {{ selectedToDelete.length }} of
                    {{ selectedPermissions.length }} selected
                  </p>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="selectAllAssigned"
                    :disabled="!selectedPermissions.length"
                  >
                    Select All
                  </UiButton>
                  <UiButton
                    variant="outline"
                    size="sm"
                    @click="unselectAllAssigned"
                    :disabled="!selectedToDelete.length"
                  >
                    Unselect All
                  </UiButton>
                  <UiButton
                    size="sm"
                    class="w-fit ml-auto bg-red-600 text-white"
                    :disabled="selectedToDelete.length === 0 || deleteLoading"
                    @click="deleteSelectedPermissions"
                  >
                    <Icon
                      name="heroicons:trash"
                      v-if="!deleteLoading"
                      class="mr-2 h-4 w-4"
                    ></Icon>
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="deleteLoading"
                      :disabled="deleteLoading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>
                    Delete
                    {{
                      selectedToDelete.length
                        ? `(${selectedToDelete.length})`
                        : ""
                    }}
                  </UiButton>
                </div>
                <UiCard class="px-4 py-2 flex-1 flex flex-col overflow-y-auto">
                  <template v-if="selectedPermissions.length > 0">
                    <FormField
                      v-for="permission in permissionsData.filter((p) =>
                        selectedPermissions.includes(p.permissionCode)
                      )"
                      :key="permission.permissionCode"
                      :model-value="
                        selectedToDelete.includes(permission.permissionCode)
                      "
                      name="selectedPermissions"
                    >
                      <FormItem class="flex items-center gap-2">
                        <FormControl>
                          <UiCheckbox
                            :checked="
                              selectedToDelete.includes(
                                permission.permissionCode
                              )
                            "
                            @update:checked="
                              (checked) => {
                                if (checked) {
                                  selectedToDelete.push(
                                    permission.permissionCode
                                  );
                                } else {
                                  selectedToDelete = selectedToDelete.filter(
                                    (permissionCode) =>
                                      permissionCode !==
                                      permission.permissionCode
                                  );
                                }
                              }
                            "
                          />
                        </FormControl>
                        <FormLabel>
                          {{ permission.permissionCode }}
                        </FormLabel>
                      </FormItem>
                    </FormField>
                  </template>
                  <template v-else>
                    <div class="text-center text-gray-400 py-8">
                      No selected permissions to remove.
                    </div>
                  </template>
                </UiCard>
                <UiButton
                  class="mt-4 w-full bg-red-600 text-white"
                  :disabled="selectedToDelete.length === 0 || deleteLoading"
                  @click="deleteSelectedPermissions"
                >
                  <Icon
                    name="heroicons:trash"
                    v-if="!deleteLoading"
                    class="mr-2 h-4 w-4"
                  ></Icon>
                  <Icon
                    name="svg-spinners:8-dots-rotate"
                    v-if="deleteLoading"
                    :disabled="deleteLoading"
                    class="mr-2 h-4 w-4 animate-spin"
                  ></Icon>
                  Delete
                  {{
                    selectedToDelete.length
                      ? `(${selectedToDelete.length})`
                      : ""
                  }}
                </UiButton>
              </div>
            </div>
          </div>
          <div
            class="w-full p-6"
            v-else-if="permissionsData.length == 0 && !isError"
          >
            <UiNoResultFound title="Sorry, No contract core customer permission found." />
          </div>
          <div v-if="isError" class="w-full">
            <ErrorMessage title="Something went wrong." :retry="refetch" />
          </div>
        </UiCard>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
