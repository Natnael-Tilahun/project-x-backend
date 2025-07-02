<script lang="ts" setup>
const openItems = ref(["applicationDetails"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { applicationFormSchema } from "~/validations/applicationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { Platform } from "@/global-types";
import type { Application } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const { getApplicationById, updateApplication } = useApplications();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const applicationId = ref<string>("");
const loading = ref(false);
const isSubmitting = ref(false);
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "applicationDetails";

const isError = ref(false);
const data = ref<Application>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
applicationId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: applicationFormSchema,
});

const dateFormatter = (date: string) => {
  return new Date(date).toISOString().split("T")[0];
};

const fetchApplicationData = async () => {
  try {
    loading.value = true;
    data.value = await getApplicationById(applicationId.value);
    form.setValues({
      ...data.value,
      createdDate: data.value.createdDate
        ? dateFormatter(data.value.createdDate)
        : "",
      lastModifiedDate: data.value.lastModifiedDate
        ? dateFormatter(data.value.lastModifiedDate)
        : "",
    });
  } catch (err) {
    console.error("Error fetching application:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchApplicationData();
});

const refetch = async () => {
  await fetchApplicationData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    const dataToUpdate = {
      ...values,
      createdDate: new Date(values.createdDate).toISOString(),
      lastModifiedDate: new Date(values.lastModifiedDate).toISOString(),
    };
    data.value = await updateApplication(applicationId.value, dataToUpdate); // Call your API function to fetch profile
    navigateTo(`/applications/${data.value.id}`);
    toast({
      title: "Application Updated",
      description: "Application updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating application:", err.message);
  } finally {
    isSubmitting.value = false;
  }
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    refetch();
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiTabs v-else-if="!loading" v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION" >
        <UiTabsTrigger
          value="applicationDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'applicationDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Application Details
        </UiTabsTrigger>
        </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION_VERSION" >
        <UiTabsTrigger
          value="applicationVersions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'applicationVersions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Application Versions
        </UiTabsTrigger>
        </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.CREATE_APPLICATION_VERSION" >
        <UiTabsTrigger
          value="newApplicationVersion"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newApplicationVersion',
              },
            })
          "
          :disabled="openItems != 'newApplicationVersion'"
          :class="openItems == 'newApplicationVersion' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Application Version
        </UiTabsTrigger>
        </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION_VERSION" >
        <UiTabsTrigger
          value="applicationVersionDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'applicationVersionDetails',
              },
            })
          "
          :disabled="openItems != 'applicationVersionDetails'"
          :class="openItems == 'applicationVersionDetails' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Application Version Details
        </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>

  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION" >
      <UiTabsContent
        value="applicationDetails"
        class="text-base bg-background p-6 rounded-lg"
      >
        <UiCard v-if="data && !isError" class="w-full p-6">
          <form @submit="onSubmit">
            <div class="grid grid-cols-2 gap-6">
              <FormField v-slot="{ componentField }" name="id">
                <FormItem>
                  <FormLabel>Application Id </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      disabled
                      placeholder="Enter application Id"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                  <FormLabel>Application Name </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application Name"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="description">
                <FormItem>
                  <FormLabel>Application Description </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application description"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="platform">
                <FormItem>
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
                <FormItem>
                  <FormLabel>Download URL </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application download url"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="bundleId">
                <FormItem>
                  <FormLabel> Application Bundle ID </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application bundle id"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="appStoreId">
                <FormItem>
                  <FormLabel>Application App Store ID </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application app store id"
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
                <FormItem>
                  <FormLabel> Application Icon URL </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter application icon url"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="createdBy">
                <FormItem>
                  <FormLabel> Created By </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      disabled
                      placeholder="Enter created by"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="createdDate">
                <FormItem>
                  <FormLabel> Created Date </FormLabel>
                  <FormControl>
                    <UiInput
                      type="date"
                      disabled
                      placeholder="Enter created date"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastModifiedDate">
                <FormItem>
                  <FormLabel> Last Modified Date </FormLabel>
                  <FormControl>
                    <UiInput
                      type="date"
                      disabled
                      placeholder="Enter last modified date"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastModifiedBy">
                <FormItem>
                  <FormLabel> Last Modified By </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      disabled
                      placeholder="Enter last modified by"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <UiPermissionGuard permission="UPDATE_APPLICATIONS" >
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
        </UiCard>
        <div v-else-if="data == null || data == undefined">
          <UiNoResultFound title="Sorry, No application found." />
        </div>
        <div v-else-if="isError">
          <ErrorMessage :retry="refetch" title="Something went wrong." />
        </div>
      </UiTabsContent>
      </UiPermissionGuard>

  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION_VERSION" >
      <UiTabsContent
        value="applicationVersions"
        class="text-base bg-background p-6 rounded-lg"
      >
        <ApplicationVersion :applicationId="applicationId" />
      </UiTabsContent>
      </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.CREATE_APPLICATION_VERSION" >
      <UiTabsContent
        value="newApplicationVersion"
        class="text-base bg-background p-6 rounded-lg"
      >
        <ApplicationVersionNewApplicationVersion
          :applicationId="applicationId"
        />
      </UiTabsContent>
      </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.READ_APPLICATION_VERSION" >
      <UiTabsContent
        value="applicationVersionDetails"
        class="text-base bg-background p-6 rounded-lg"
      >
        <ApplicationVersionDetails :applicationId="applicationId" />
      </UiTabsContent>
      </UiPermissionGuard>
    </UiTabs>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
