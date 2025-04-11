<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newUssdLanguageFormSchema } from "~/validations/newUssdLanguageFormSchema";
import type { UssdLanguage } from "~/types";
import { LanguageRelatedStatus } from "~/global-types";

const { createNewUssdLanguage, getUssdLanguages, isLoading } =
  useUssdLanguages();
const isError = ref(false);
const data = ref<UssdLanguage>();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newUssdLanguageFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  console.log("values: ", values);

  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const updatedValues = {
      ...values,
      status: values.status ? "Visible" : "Disable",
    };
    data.value = await createNewUssdLanguage(updatedValues); // Call your API function to fetch profile
    navigateTo(`/ussdLanguages`);
    console.log("New ussd language data; ", data.value);
    toast({
      title: "Ussd Language Created",
      description: "Ussd Language created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new ussd language:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Ussd Language</h1>
      <p class="text-sm text-muted-foreground">
        Create new ussd language by including language name, language type,
        status
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="languageName">
              <FormItem>
                <FormLabel>Language Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter language name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="languageType">
              <FormItem>
                <FormLabel>Language Type </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter language type"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>


            <FormField v-slot="{ componentField }" name="status">
              <FormItem>
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
                        v-for="item in Object.values(LanguageRelatedStatus)"
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
