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
import { ApplicationVersion } from "@/types/applicationVersion";
import { splitPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";
const { getApplicationVersionById, updateApplicationVersion } =
  await useApplications();
const isError = ref(false);
const loading = ref(false);
const data = ref<ApplicationVersion>();
const applicationId = ref<string>("");
const applicationVersionId = ref<string>("");
const route = useRoute();
const fullPath = ref(route.path);
const pathSegments = ref([]);

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
applicationId.value = pathSegments.value[pathLength - 1];
applicationVersionId.value = route.query.applicationVersionId;

const isSubmitting = ref(false);

const form = useForm({
  validationSchema: applicationVersionFormSchema,
});

const fetchApplicationVersionData = async () => {
  try {
    loading.value = true;
    data.value = await getApplicationVersionById(
      applicationId.value,
      applicationVersionId.value
    );
    // Format the date to YYYY-MM-DD for the input type="date"
    const formattedDate = data.value?.releaseDate
      ? new Date(data.value.releaseDate).toISOString().split("T")[0]
      : "";

    form.setValues({
      ...data.value,
      releaseDate: formattedDate,
    });
  } catch (err) {
    console.error("Error fetching application version:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchApplicationVersionData();
});

const refetch = async () => {
  await fetchApplicationVersionData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const data = {
      ...values,
      releaseDate: values.releaseDate
        ? new Date(values.releaseDate).toISOString()
        : "",
    };
    data.value = await updateApplicationVersion(
      applicationId.value,
      applicationVersionId.value,
      data
    );
    form.setValues({
      ...data.value,
      releaseDate: data.value?.releaseDate
        ? new Date(data.value.releaseDate).toISOString().split("T")[0]
        : "",
    });
    toast({
      title: "Application Version Updated",
      description: "Application version updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating application version:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <UiCard
      v-else-if="data && !isError"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
      <div class="text-sm md:text-base p-6 basis-full">
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

            <UiPermissionGuard :permission="PermissionConstants.UPDATE_APPLICATION_VERSIONS" >
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

                Update
              </UiButton>
            </div>
            </UiPermissionGuard>
          </div>
        </form>
      </div>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No application found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
