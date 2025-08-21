<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newUserRoleformSchema } from "~/validations/newUserRoleformSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { RoleScope } from "~/global-types";
import type { Role } from "~/types";

const { createNewMerchantOperatorRole } = await useMerchantRoles();
const isError = ref(false);
const data = ref<Role>();

const isSubmitting = ref(false);
const activeTab = ref<string>("roleDetails"); // Reactive variable to manage active tab

const form = useForm({
  validationSchema: newUserRoleformSchema,
  initialValues: {
    name: "",
    description: "",
    enabled: true,
    enforce2fa: false,
    effectiveToAllBranch: false,
    scope: RoleScope.MERCHANT
  },
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    data.value = await createNewMerchantOperatorRole(values); // Call your API function to fetch profile
    navigateTo(`/merchantRoles`);
    console.log("New merchant role data; ", data.value);
    toast({
      title: "Merchant Role Created",
      description: "Merchant Role created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new merchant role:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Add New Role</h1>
      <p class="text-sm text-muted-foreground">
        Create new merchant role, role access and system permissions
      </p>
    </div>

    <UiCard
      default-value="roleDetails"
      :model-value="activeTab"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem class="w-full">
                <FormLabel> Role Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Role Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="description">
              <FormItem class="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Description"
                    class="resize-y"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="enabled">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Enabled </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="enforce2fa">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Enforce 2fa </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="effectiveToAllBranch">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Effective To All Branch </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
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
                        :disabled="true"
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

            <!-- <FormField v-slot="{ componentField }" name="permission">
              <FormItem>
                <FormLabel>Permissions</FormLabel>

                <UiSelect
                  multiple
                  v-model="selectedPermissions"
                  v-bind="componentField"
                >
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select permissions" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in data"
                        :key="item.code"
                        :value="item.code"
                      >
                        {{ item.code }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField> -->

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
