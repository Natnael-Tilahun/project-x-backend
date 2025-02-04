<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { applicationVersionFormSchema } from "~/validations/applicationVersionFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { UpdatePolicy, AppVersionStatus } from "@/global-types";
import { splitPath } from "~/lib/utils";
const { createNewApplicationVersion, isLoading } = await useApplications();
const isError = ref(false);
const data = ref<Application>();
const applicationId = ref<string>("");
const route = useRoute();
const fullPath = ref(route.path);
const pathSegments = ref([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
applicationId.value = pathSegments.value[pathLength - 1];
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: applicationVersionFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const data = {
      ...values,
      releaseDate: values.releaseDate
        ? new Date(values.releaseDate).toISOString()
        : "",
    };
    data.value = await createNewApplicationVersion(applicationId.value, data); // Call your API function to fetch profile
    navigateTo(
      `/applications/${applicationId.value}?activeTab=applicationVersions`
    );
    console.log("New application version data; ", data.value);
    toast({
      title: "Application Version Created",
      description: "Application version created successfully",
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
      <h1 class="md:text-2xl text-lg font-medium">
        Add New Application Version
      </h1>
      <p class="text-sm text-muted-foreground">
        Create new application version
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="versionName">
              <FormItem class="w-full">
                <FormLabel> Version Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Version Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="versionNumber">
              <FormItem class="w-full">
                <FormLabel>Version Number</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Version Number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="isRevoked">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel class="text-base"> Is Revoked </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
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

            <FormField v-slot="{ componentField }" name="updatePolicy">
              <FormItem class="w-full">
                <FormLabel> Update Policy </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a update policy" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(UpdatePolicy)"
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
              <FormItem class="w-full">
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
                        v-for="item in Object.values(AppVersionStatus)"
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

            <FormField v-slot="{ componentField }" name="buildNumber">
              <FormItem class="w-full">
                <FormLabel>Build Number</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Application Build Number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="minRequiredVersion">
              <FormItem class="w-full">
                <FormLabel>Min Required Version</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Min Required Version"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="apiKeyHash">
              <FormItem class="w-full">
                <FormLabel>API Key Hash</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter API Key Hash"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="allowedChecksum">
              <FormItem class="w-full">
                <FormLabel>Allowed Checksum</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Allowed Checksum"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="releaseNotes">
              <FormItem class="w-full">
                <FormLabel>Release Notes</FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Release Notes"
                    class="resize-y"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="releaseDate">
              <FormItem class="w-full">
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter Release Date"
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
