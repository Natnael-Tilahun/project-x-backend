<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref, onBeforeUnmount } from "vue";
import { toast } from "~/components/ui/toast";
import { newStaffFormSchema } from "~/validations/newStaffFormSchema";
import type { Office, Staff } from "~/types";
const { createNewStaff, isLoading } = useStaffs();
const isError = ref(false);
const data = ref<Staff>();
const isSubmitting = ref(false);
const loading = ref(false);

const form = useForm({
  validationSchema: newStaffFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    console.log("values: ", values);
    const newValues = {
      ...values,
      joiningDate: new Date().toISOString(),
    }
    const response = await createNewStaff(newValues); // Call your API function to fetch profile
    data.value = response
    console.log("New staff data; ", data.value);
    toast({
      title: "Staff Created",
      description: "Staff created successfully",
    });
    navigateTo(`/staffs`);
  } catch (err: any) {
    console.error("Error creating new staff:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
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
      <h1 class="md:text-2xl text-lg font-medium">Create New Staff</h1>
      <p class="text-sm text-muted-foreground">
        Create new staff by including First Name,external id, email, origanizational role type and phone number
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="firstname">
              <FormItem>
                <FormLabel>First Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter staff first name"
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
                    placeholder="Enter staff last name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="emailAddress">
              <FormItem>
                <FormLabel> Email Address </FormLabel>
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
