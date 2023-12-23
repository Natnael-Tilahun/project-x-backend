<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newCustomerRoleformSchema } from "~/validations/newCustomerRoleformSchema";

const isLoading = ref(false);
const activeTab = ref<string>("customerRoleDetails"); // Reactive variable to manage active tab

// Function to handle tab switching
const switchToAssignFeaturesTab = () => {
  activeTab.value = "assignFeaturesAndActions";
};

const form = useForm({
  validationSchema: newCustomerRoleformSchema,
  initialValues: {
    active: true,
  },
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
  <div class="w-full flex flex-col gap-6">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Add Customer Role</h1>
      <p class="text-sm text-muted-foreground">
        Create new customer role, assign features, actions and limits
      </p>
    </div>

    <UiTabs
      default-value="customerRoleDetails"
      :model-value="activeTab"
      class="md:space-y-4 w-full flex gap-10 border-[1px] h-screen"
    >
      <UiTabsList
        class="flex bg-secondary h-full justify-start items-start w-fit flex-col border-r-2"
      >
        <UiTabsTrigger
          value="customerRoleDetails"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          Customer Role Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="assignFeaturesAndActions"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          Assign Features and Actions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="assignLimits"
          class="md:text-base py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary w-full"
        >
          Assign Limits
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="customerRoleDetails"
        class="text-sm md:text-base p-4 basis-full"
      >
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="customerRoleName">
              <FormItem>
                <FormLabel>Name of the Customer Role</FormLabel>
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
            <FormField v-slot="{ componentField }" name="rollType">
              <FormItem>
                <FormLabel>Roll Type</FormLabel>

                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select Role Type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="Business Banking">
                        Business Banking
                      </UiSelectItem>
                      <UiSelectItem value="Retail Banking">
                        Retail Banking
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="discription">
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

            <FormField v-slot="{ value, handleChange }" name="active">
              <FormItem class="space-y-0.5 col-span-full flex gap-5">
                <FormLabel class="text-base"> Active </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
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
      </UiTabsContent>

      <UiTabsContent
        value="assignFeaturesAndActions"
        class="space-y-4 text-sm md:text-base p-5 basis-full"
      >
        <div class="flex flex-col md:gap-4 w-full">
          <h1>Assign Features And Actions</h1>
        </div>
      </UiTabsContent>

      <UiTabsContent
        value="assignLimits"
        class="space-y-4 text-sm md:text-base p-5 basis-full"
      >
        <div class="flex flex-col md:gap-4 w-full">
          <h1>Assign Limits</h1>
        </div>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>

<style lang="css" scoped></style>
