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
  <div class="flex flex-col gap-5 items-center h-screen p-0 bg-secondary">
    <div class="w-full flex flex-col gap-5 p-6 bg-card shadow-none rounded-md">
      <h1 class="text-lg">Add User Role</h1>
      <UiTabs
        default-value="roleDetails"
        :model-value="activeTab"
        class="md:space-y-4 w-full flex gap-10 border-[1px] min-h-screen"
      >
        <UiTabsList
          class="flex bg-secondary h-full justify-start py-7 items-start px-0 w-fit flex-col border-r-2"
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
          class="space-y-4 text-sm md:text-base p-5 basis-full"
        >
          <div class="flex flex-col md:gap-4 w-full">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-8">
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

                <div class="col-span-full w-full flex justify-between">
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
          </div>
        </UiTabsContent>

        <UiTabsContent
          value="cusomerAccess"
          class="space-y-4 text-sm md:text-base p-5 basis-full"
        >
          <div class="flex flex-col md:gap-4 w-full">
            <h1>Customer Access</h1>
          </div>
        </UiTabsContent>

        <UiTabsContent
          value="systemPermission"
          class="space-y-4 text-sm md:text-base p-5 basis-full"
        >
          <div class="flex flex-col md:gap-4 w-full">
            <h1>System Permissions</h1>
          </div>
        </UiTabsContent>
      </UiTabs>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
