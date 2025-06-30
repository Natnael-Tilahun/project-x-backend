<script lang="ts" setup>
const openItems = ref("staffDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newStaffFormSchema } from "~/validations/newStaffFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Staff } from "~/types";
import { dateFormatter } from "~/lib/utils";
import ResetPassword from "~/components/staffs/ResetPassword.vue";
import { PermissionConstants } from "~/constants/permissions";
const route = useRoute();
const {
  getStaffById,
  updateStaff,
  activateStaff,
  deactivateStaff,
  isLoading,
  isSubmitting,
} = useStaffs();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const staffId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<Staff>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
staffId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newStaffFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
      joiningDate: new Date().toISOString(),
    };
    data.value = await updateStaff(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/staffs/${data.value.id}`);
    console.log("New staff data; ", data.value);
    toast({
      title: "Staff Created",
      description: "Staff created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new staff:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const fetchStaffData = async () => {
  try {
    loading.value = true;
    data.value = await getStaffById(staffId.value);
    let a = {
      ...data.value,
      username: data.value?.user?.login,
      joiningDate: data.value.joiningDate
        ? dateFormatter(data.value.joiningDate)
        : "",
    };
    form.setValues(a);
  } catch (err) {
    console.error("Error fetching staff:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const handleStaffActivation = async () => {
  try {
    submitting.value = true;

    if (data.value?.active) {
      data.value = await deactivateStaff(staffId.value); // Call your API function to fetch roles
    } else {
      data.value = await activateStaff(staffId.value); // Call your API function to fetch roles
    }

    toast({
      title: `${
        data.value?.active
          ? "Staff activated successfully. "
          : "Staff deactivated successfully. "
      }`,
    });
  } catch (err: any) {
    console.error("Error activating staff:", err);
    toast({
      title: "Uh oh! Something went wrong.",
      description: `There was a problem with your request: ${err}`,
      variant: "destructive",
    });

    // isError.value = true;
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchStaffData();
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
      if (
        newActiveTab == "staffDetails" ||
        newActiveTab == "staffAssignments"
      ) {
        fetchStaffData();
      }
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiTabs
      v-else-if="data && !isError"
      v-model="openItems"
      class="w-full space-y-0"
    >
      <div class="w-full flex justify-end mb-4 gap-4 px-6">
        <UiPermissionGuard :permission="data?.active ? PermissionConstants.DISABLE_STAFF : PermissionConstants.ENABLE_STAFF">

        <UiButton
          size="sm"
          @click="handleStaffActivation"
          :disabled="submitting"
          :class="data?.active ? 'bg-red-600' : 'bg-green-600'"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="submitting"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          {{ data?.active ? "Deactivate" : "Activate" }}
        </UiButton>
        </UiPermissionGuard>
        <!-- <UiButton class="bg-red-600">Deactivate</UiButton> -->
      </div>
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiPermissionGuard :permission=PermissionConstants.READ_STAFF>
          <UiTabsTrigger
            value="staffDetails"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'staffDetails',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Detail Info
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_STAFF_ASSIGNMENT>
          <UiTabsTrigger
            value="staffAssignments"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'staffAssignments',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Assignments
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.RESET_STAFF_PIN >
        <UiTabsTrigger
          value="resetPassword"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'resetPassword',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Reset Password
        </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>
      <UiPermissionGuard :permission=PermissionConstants.READ_STAFF>
        <UiTabsContent
          value="staffDetails"
          class="text-base bg-background rounded-lg"
        >
          <UiCard class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <FormField v-slot="{ componentField }" name="id">
                  <FormItem>
                    <FormLabel>Staff Id </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        disabled
                        placeholder="Enter staff Id"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="firstname">
                  <FormItem>
                    <FormLabel>First Name </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter first name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="lastname">
                  <FormItem>
                    <FormLabel>Last Name </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter last name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="emailAddress">
                  <FormItem>
                    <FormLabel>Email Address </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter email address"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter staff user name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="active">
                  <FormItem>
                    <FormLabel>Active</FormLabel>
                    <FormControl>
                      <div class="flex items-start gap-2 h-full">
                        <UiBadge
                        class="w-fit h-fit py-1 px-4"
                             :class="data?.active  ? 'bg-green-500' : 'bg-red-500'"
                        >
                          {{ data?.active ? "Active" : "Inactive" }}
                      </UiBadge>
                    </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <UiPermissionGuard permission="UPDATE_STAFF">
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
                </UiPermissionGuard>
              </div>
            </form>
          </UiCard>
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.READ_STAFF_ASSIGNMENT>
        <UiTabsContent
          value="staffAssignments"
          class="text-base bg-background rounded-lg p-6"
        >
          <!-- <UiCard class="w-full p-6">
        Staff Assignments
      </UiCard> -->
          <StaffsAssignments />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.RESET_STAFF_PIN >
      <UiTabsContent
        value="resetPassword"
        class="text-base bg-background rounded-lg p-6"
      >
        <ResetPassword :email="data?.emailAddress || ''" :staffId="staffId" />
      </UiTabsContent>
      </UiPermissionGuard>
    </UiTabs>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No staff found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
