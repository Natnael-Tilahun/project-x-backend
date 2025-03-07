<script lang="ts" setup>

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { permissionGroupFormSchema } from "~/validations/permissionGroupFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { PermissionGroup } from "~/types";
import { RoleScope, PermissionGroupStatus } from "@/global-types";

const route = useRoute();
const { getPermissionGroupById, updatePermissionGroup, isLoading, isUpdating } =
  usePermissionGroups();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const permissionGroupId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isUpdating.value);

const isError = ref(false);
const data = ref<PermissionGroup>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
permissionGroupId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: permissionGroupFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
    data.value = await getPermissionGroupById(permissionGroupId.value);
  let a = {
        ...data.value,
  };
  form.setValues(a);
} catch (err) {
  console.error("Error fetching permission group:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isUpdating.value = true;
    data.value = await updatePermissionGroup(permissionGroupId.value, values); // Call your API function to fetch profile
    navigateTo(`/permissionGroups/${data.value.groupCode}`);
    toast({
      title: "Permission Group Updated",
      description: "Permission Group updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating permission group:", err);
    isError.value = true;
  } finally {
    isUpdating.value = false;
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
          <FormField v-slot="{ componentField }" name="groupCode">
            <FormItem>
              <FormLabel>Permission Group Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  
                  placeholder="Enter permission group code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Permission Group Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter permission group name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Permission Group Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter permission group description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="scope">
              <FormItem>
                <FormLabel> Scope </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
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
                        v-for="item in Object.values(PermissionGroupStatus)"
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
