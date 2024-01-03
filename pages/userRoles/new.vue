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

const isLoading = ref(false);
const activeTab = ref<string>("roleDetails"); // Reactive variable to manage active tab
// Function to handle tab switching
const switchToAssignFeaturesTab = () => {
  activeTab.value = "cusomerAccess";
};

const form = useForm({
  validationSchema: newUserRoleformSchema,
});

const onSubmit = form.handleSubmit((values: any) => {
  console.log("Form submitted!", values);
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    switchToAssignFeaturesTab();
  }, 3000);
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Add User Role</h1>
      <p class="text-sm text-muted-foreground">
        Create new user role, customer access and system permissions
      </p>
    </div>

    <UiTabs
      default-value="roleDetails"
      :model-value="activeTab"
      class="w-full flex border-[1px] rounded-lg h-screen"
    >
      <UiTabsList
        class="flex bg-secondary h-screen justify-start items-start w-fit flex-col"
      >
        <UiTabsTrigger
          value="roleDetails"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          Role Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="cusomerAccess"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          Customer Access
        </UiTabsTrigger>
        <UiTabsTrigger
          value="systemPermission"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          System Permissions
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="roleDetails"
        class="text-sm md:text-base p-6 basis-full"
      >
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="roleName">
              <FormItem>
                <FormLabel> Role Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Customer Role Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="legalEntity">
              <FormItem>
                <FormLabel>Legal Entity</FormLabel>

                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select Legal Entity" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="Model Bank">
                        Modle Bank
                      </UiSelectItem>
                      <UiSelectItem value="Retail Banking">
                        Modle Bank Djibuty
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
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

            <div class="col-span-full w-full py-4 flex justify-between">
              <UiButton
                :disabled="isLoading"
                variant="outline"
                type="button"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <UiButton :disabled="isLoading" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isLoading"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Next
              </UiButton>
            </div>
          </div>
        </form>
      </UiTabsContent>

      <UiTabsContent
        value="cusomerAccess"
        class="space-y-4 text-sm md:text-base p-6 basis-full"
      >
        <div class="flex flex-col md:gap-4 w-full">
          <h1>Customer Access</h1>
        </div>
      </UiTabsContent>

      <UiTabsContent
        value="systemPermission"
        class="space-y-4 text-sm md:text-base p-6 basis-full"
      >
        <div class="flex flex-col md:gap-4 w-full">
          <h1>System Permissions</h1>
        </div>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>

~/validations/newUserRoleformSchema
