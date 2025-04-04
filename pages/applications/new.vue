<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { applicationFormSchema } from "~/validations/applicationFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { Platform } from "@/global-types";
const { createNewApplication, isLoading } = await useApplications();
const isError = ref(false);
const data = ref<Application>();

const isSubmitting = ref(false);
const activeTab = ref<string>("roleDetails"); // Reactive variable to manage active tab

const form = useForm({
  validationSchema: applicationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    data.value = await createNewApplication(values); // Call your API function to fetch profile
    navigateTo(`/applications/${data.value.id}`);
    toast({
      title: "Application Created",
      description: "Application created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new application:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Add New Application</h1>
      <p class="text-sm text-muted-foreground">Create new application</p>
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
                <FormLabel> Application Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Application Name"
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
                    placeholder="Enter Application  Description"
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

            <FormField v-slot="{ componentField }" name="platform">
              <FormItem class="w-full">
                <FormLabel> Platform </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a platform" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(Platform)"
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

            <FormField v-slot="{ componentField }" name="downloadUrl">
              <FormItem class="w-full">
                <FormLabel>Download URL</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Application Download URL"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="bundleId">
              <FormItem class="w-full">
                <FormLabel>Bundle ID</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Application Bundle ID"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="appStoreId">
              <FormItem class="w-full">
                <FormLabel>App Store ID</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter App Store ID"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="enabled">
                <FormItem>
                  <FormLabel> Enabled </FormLabel>
                  <FormControl>
                    <UiSwitch :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

            <FormField v-slot="{ componentField }" name="iconUrl">
              <FormItem class="w-full">
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Icon URL"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

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
