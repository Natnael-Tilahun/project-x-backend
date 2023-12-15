<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroupItem } from "radix-vue";
// import { newCustomerRoleformSchema } from "~/validations/newCustomerRoleformSchema";

const isLoading = ref(false);

const form = useForm({
  validationSchema: "",
  initialValues: {
    active: true,
  },
});

const onSubmit = form.handleSubmit((values: any) => {
  console.log("Form submitted!", values);
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
  }, 3000);
});
</script>

<template>
  <div
    class="flex flex-col w-full items-center h-screen xl:p-10 border-0 gap-8"
  >
    <form
      @submit="onSubmit"
      class="border-[1px] p-6 space-y-6 shadow-sm h-full w-full rounded-md"
    >
      <div class="flex justify-between border-b-[1px] py-2">
        <h1 class="text-xl font-medium">Add Category</h1>
        <FormField v-slot="{ value, handleChange }" name="active">
          <FormItem class="space-y-0.5 col-span-full flex gap-5">
            <FormLabel class="text-base"> Active </FormLabel>
            <FormControl>
              <UiSwitch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <!-- <div class="flex flex-col md:gap-4 w-full"> -->
      <div class="grid grid-cols-3 gap-8 justify-between h-full">
        <FormField v-slot="{ componentField }" name="categoryName">
          <FormItem>
            <FormLabel>Category Name</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="Security"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="entity">
          <FormItem>
            <FormLabel>Entity</FormLabel>

            <UiSelect v-bind="componentField">
              <FormControl>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a Enitity" />
                </UiSelectTrigger>
              </FormControl>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem value="Money Bank Ethiopia">
                    Money Bank Ethiopia
                  </UiSelectItem>
                  <UiSelectItem value="Other"> Other </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="accountLevelAlert">
          <FormItem class="space-y-3">
            <FormLabel>Account Level Alert</FormLabel>

            <FormControl>
              <UiRadioGroup class="flex space-y-1" v-bind="componentField">
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <UiRadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel class="font-normal"> Yes </FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-3">
                  <FormControl>
                    <UiRadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel class="font-normal"> No </FormLabel>
                </FormItem>
              </UiRadioGroup>
            </FormControl>
          </FormItem>
        </FormField>

        <!-- <FormField v-slot="{ componentField }" name="discription">
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
        </FormField> -->

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
      <!-- </div> -->
    </form>
  </div>
</template>
