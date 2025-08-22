<script lang="ts" setup>
const openItems = ref("groupDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newCustomerGroupFormSchema } from "~/validations/newCustomerGroupFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { CustomerGroup } from "~/types";
import {  getIdFromPath } from "~/lib/utils";
import ResetPassword from "~/components/staffs/ResetPassword.vue";
import { PermissionConstants } from "~/constants/permissions";
import { CustomerGroupType } from "~/global-types";

const route = useRoute();
const {
  getCustomerGroupById,
  updateCustomerGroups,
  isLoading,
  isSubmitting,
} = useCustomerGroups();

const customerGroupId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const isError = ref(false);
const data = ref<CustomerGroup>();
customerGroupId.value = getIdFromPath()

const form = useForm({
  validationSchema: newCustomerGroupFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const newValues = {
      ...values,
    };
    data.value = await updateCustomerGroups(values.id, newValues); // Call your API function to fetch profile
    navigateTo(`/customerGroups/${data.value.id}`);
    toast({
      title: "Customer group Created",
      description: "Customer group created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new customer group:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

const fetchCustomerGroupData = async () => {
  try {
    loading.value = true;
    data.value = await getCustomerGroupById(customerGroupId.value);
    let a = {
      ...data.value,
    };
    form.setValues(a);
  } catch (err) {
    console.error("Error fetching customer group:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchCustomerGroupData();
});

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
      if (
        newActiveTab == "groupDetails" ||
        newActiveTab == "members" ||
        newActiveTab == "memberDetails" ||
        newActiveTab == "paymentIntegrations" ||
        newActiveTab == ""
      ) {
        fetchCustomerGroupData();
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
    <UiTabs v-else-if="data && !isError" v-model="openItems" class="w-full space-y-0">
      <UiTabsList class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0">
        <UiPermissionGuard :permission=PermissionConstants.READ_STAFF>
          <UiTabsTrigger value="groupDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'groupDetails',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Detail Info
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_STAFF_ASSIGNMENT>
          <UiTabsTrigger value="members" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'members',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Members
          </UiTabsTrigger>
          <UiTabsTrigger
          value="memberDetails"
          :disabled="openItems != 'memberDetails'"
          :class="openItems == 'memberDetails' ? '' : 'hidden'"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'memberDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Member Details
        </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_STAFF_ASSIGNMENT>
          <UiTabsTrigger value="paymentIntegrations" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'paymentIntegrations',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Payment Integrations
          </UiTabsTrigger>
          <UiTabsTrigger
          value="integrationDetails"
          :disabled="openItems != 'integrationDetails'"
          :class="openItems == 'integrationDetails' ? '' : 'hidden'"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'integrationDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Integration Details
        </UiTabsTrigger>
        </UiPermissionGuard>


      </UiTabsList>
      <UiPermissionGuard :permission=PermissionConstants.READ_STAFF>
        <UiTabsContent value="groupDetails" class="text-base bg-background rounded-lg">
          <UiCard class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <FormField v-slot="{ componentField }" name="id">
                  <FormItem>
                    <FormLabel>Customer Group Id </FormLabel>
                    <FormControl>
                      <UiInput type="text" disabled placeholder="Enter group Id" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="groupName">
                  <FormItem>
                    <FormLabel>Group Name </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter group name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="groupCode">
                  <FormItem>
                    <FormLabel>Group Code</FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter group code" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="description">
                  <FormItem>
                    <FormLabel>Description </FormLabel>
                    <FormControl>
                      <UiTextarea type="text" placeholder="Enter description" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="groupType">
                  <FormItem class="w-full">
                    <FormLabel> Group Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select a group type" />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem class="w-full" v-for="item in Object.values(CustomerGroupType)" :value="item">
                            <div class="flex justify-between md:gap-4 gap-2 items-center">
                              <span>{{ item }}</span>
                            </div>
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="priorityLevel">
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter priority level" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ value, handleChange }" name="isActive">
                  <FormItem class="flex flex-row items-center justify-between rounded-lg border px-4 py-2 w-full">
                    <FormLabel class="text-base"> IsActive </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                  </FormItem>
                </FormField>
                <UiPermissionGuard :permission="PermissionConstants.UPDATE_STAFF">
                  <div class="col-span-full w-full py-4 flex justify-between">
                    <UiButton :disabled="submitting" variant="outline" type="button" @click="$router.go(-1)">
                      Cancel
                    </UiButton>
                    <UiButton :disabled="submitting" type="submit">
                      <Icon name="svg-spinners:8-dots-rotate" v-if="submitting" class="mr-2 h-4 w-4 animate-spin">
                      </Icon>

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
        <UiTabsContent value="members" class="text-base bg-background rounded-lg p-6">
          <CustomerGroupsMembers />
        </UiTabsContent>
        <UiTabsContent
          value="memberDetails"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsOperatorsDetails />
        </UiTabsContent>
      </UiPermissionGuard>

      <UiPermissionGuard :permission=PermissionConstants.READ_STAFF_ASSIGNMENT>
        <UiTabsContent value="paymentIntegrations" class="text-base bg-background rounded-lg p-6">
          <CustomerGroupsPaymentIntegrations />
        </UiTabsContent>
        <UiTabsContent
          value="integrationDetails"
          class="text-base bg-background rounded-lg"
        >
          <CustomerGroupsPaymentIntegrationsDetails />
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
