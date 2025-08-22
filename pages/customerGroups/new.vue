<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref, onBeforeUnmount, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { newCustomerGroupFormSchema } from "~/validations/newCustomerGroupFormSchema";
import type { CustomerGroup, Office, Role, Staff } from "~/types";
import { CustomerGroupType } from "~/global-types";

const { createNewCustomerGroup } = useCustomerGroups();


const isError = ref(false);
const data = ref<CustomerGroup>();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newCustomerGroupFormSchema,
});


const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    console.log("values: ", values);
    const newValues = {
      ...values,
    }
    const response = await createNewCustomerGroup(newValues); // Call your API function to fetch profile
    data.value = response ? response : undefined;
    console.log("New customer group data; ", data.value);
    toast({
      title: "Customer Group Created",
      description: "Customer group created successfully",
    });
    navigateTo(`/customerGroups`);
  } catch (err: any) {
    console.error("Error creating new customer groups:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
  }
});

onBeforeUnmount(() => {
  isError.value = false;
  data.value = undefined;
  isSubmitting.value = false;
});

</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Customer Group</h1>
      <p class="text-sm text-muted-foreground">
        Create new staff by including group name,group code, email, origanizational role type and phone number
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="groupName">
              <FormItem>
                <FormLabel>
                  Group Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter group name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="groupCode">
              <FormItem>
                <FormLabel>Group Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter group code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel>Description </FormLabel>
                <FormControl>
                  <UiTextarea
                    type="text"
                    placeholder="Enter description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="priorityLevel">
              <FormItem>
                <FormLabel> Priority Level </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter priority level"
                    v-bind="componentField"
                  />
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
                          <span >{{ item }}</span>
                        </div>
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ value, handleChange }" name="isActive">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border px-4 py-0 w-full"
              >
                <FormLabel class="text-base"> IsActive </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
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
