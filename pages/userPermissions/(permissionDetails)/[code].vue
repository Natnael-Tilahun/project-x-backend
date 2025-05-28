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
import {
  PermissionCategory,
  PermissionScope,
  PermissionType,
} from "~/global-types";
import type { Permission } from "~/types";

const { toast } = useToast();

const { getPermissionById, enablePermission, disablePermission } =
  usePermissions();
const loading = ref(false);
const updating = ref(false);
const isError = ref(false);
const data = ref<Permission | null>(null);
const route = useRoute();
const code: string = route.params.code as string;

interface FormValues {
  createdBy?: "string";
  createdDate: "string";
  lastModifiedBy?: "string";
  lastModifiedDate?: "string";
  deletedBy?: "string";
  deletedDate?: "string";
  grouping?: "string";
  code: "string";
  entityName?: "string";
  actionName?: "string";
  description?: "string";
  scope?: PermissionScope;
  type?: PermissionType;
  category?: PermissionCategory;
  enabled?: boolean;
  deleted?: boolean;
}

const form = useForm<FormValues>({
  // validationSchema: rolesFormSchema,
});

const refetch = async () => {
  await fetchPermissionData();
};

const fetchPermissionData = async () => {
  try {
    loading.value = true;
    const fetchedData = await getPermissionById(code); // Call your API function to fetch roles
    console.log("fetchedData: ", fetchedData);
    if (fetchedData) {
      data.value = fetchedData;
      const formValues: any = {
        ...data.value,
        createdDate: fetchedData?.createdDate
          ? new Date(fetchedData?.createdDate).toLocaleDateString()
          : "",
        lastModifiedDate: fetchedData?.lastModifiedDate
          ? new Date(fetchedData?.lastModifiedDate).toLocaleDateString()
          : "",
        deletedDate: fetchedData?.deletedDate
          ? new Date(fetchedData?.deletedDate).toLocaleDateString()
          : "",
      };

      form.setValues(formValues);
    }
  } catch (err) {
    console.error("Error fetching permission", err);
    console.log(
      "Error fetching permission (stringified)",
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

const updadateRoleStatus = async (status: boolean) => {
  try {
    updating.value = true;
    if (data.value?.code) {
      if (status) {
        await enablePermission(data.value?.code); // Call your API function to fetch roles
        toast({
          title: "Permissoin status updated successfully.",
        });
      } else {
        await disablePermission(data.value?.code); // Call your API function to fetch roles
        toast({
          title: "Permissoin status updated successfully.",
        });
      }
    }
  } catch (err: any) {
    console.error("Error updating permisson status:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    updating.value = false;
  }
};

onMounted(async () => {
  await fetchPermissionData();
});
</script>

<template>
  <form @submit="">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <div v-else-if="data" class="flex flex-col gap-4 items-center">
      <UiCard class="w-full p-6 rounded-xl space-y-4">
        <div class="flex justify-end items-center">
          <div class="flex items-center gap-4">
            <UiPermissionGuard permission="UPDATE_PERMISSION">
              <UiBadge class="font-bold px-2 py-1">Enabled</UiBadge>
              <FormField v-slot="{ value, handleChange }" name="enabled">
                <FormItem>
                  <FormControl>
                    <UiSwitch
                      :checked="value"
                      @update:checked="handleChange"
                      @click="updadateRoleStatus(!value)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </UiPermissionGuard>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel> Code</FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="code"
                  v-bind="componentField"
                  aria-autocomplete="code"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="actionName">
            <FormItem>
              <FormLabel> Action Name</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="actionName"
                  v-bind="componentField"
                  aria-autocomplete="actionName"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="grouping">
            <FormItem>
              <FormLabel> Grouping</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="grouping"
                  v-bind="componentField"
                  aria-autocomplete="grouping"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="entityName">
            <FormItem>
              <FormLabel> Entity Name</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="entityName"
                  v-bind="componentField"
                  aria-autocomplete="entityName"
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
                      disabled
                      v-for="item in Object.values(PermissionScope)"
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
          <FormField v-slot="{ componentField }" name="type">
            <FormItem>
              <FormLabel> Type </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl class="min-w-[180px]">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a type" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      disabled
                      v-for="item in Object.values(PermissionType)"
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
          <FormField v-slot="{ componentField }" name="category">
            <FormItem>
              <FormLabel> Category </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl class="min-w-[180px]">
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a category" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      disabled
                      v-for="item in Object.values(PermissionCategory)"
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
          <FormField v-slot="{ componentField }" name="createdBy">
            <FormItem>
              <FormLabel> Created By</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="createdBy"
                  v-bind="componentField"
                  aria-autocomplete="createdBy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="createdDate">
            <FormItem>
              <FormLabel> Created Date</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="createdDate"
                  v-bind="componentField"
                  aria-autocomplete="createdDate"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastModifiedBy">
            <FormItem>
              <FormLabel>Last Modified By</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="lastModifiedBy"
                  v-bind="componentField"
                  aria-autocomplete="lastModifiedBy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastModifiedDate">
            <FormItem>
              <FormLabel> Last Modified Date</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="lastModifiedDate"
                  v-bind="componentField"
                  aria-autocomplete="lastModifiedDate"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="deletedBy">
            <FormItem>
              <FormLabel>Deleted By</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="deletedBy"
                  v-bind="componentField"
                  aria-autocomplete="deletedBy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="deletedDate">
            <FormItem>
              <FormLabel> Deleted Date</FormLabel>
              <FormControl class="w-full">
                <UiInput
                  type="text"
                  disabled
                  placeholder="deletedDate"
                  v-bind="componentField"
                  aria-autocomplete="deletedDate"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ value, handleChange }" name="deleted">
            <FormItem>
              <FormLabel> Deleted</FormLabel>
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
      </UiCard>
    </div>
    <div v-else>
      <UiNoResultFound title="Permissoin not found"  />
    </div>
    <div v-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </form>
</template>logout