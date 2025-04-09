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
import { newUssdMenuNamesFormSchema } from "~/validations/newUssdMenuNamesFormSchema";
import type { UssdMenuList } from "~/types";

const { createNewUssdMenu, isLoading } =
  useUssdMenus();
const isError = ref(false);
const data = ref<UssdMenuList>();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newUssdMenuNamesFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  console.log("values: ", values);

  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const updatedValues = {
      ...values,
    };
    console.log("updatedValues: ", updatedValues);
    data.value = await createNewUssdMenu(updatedValues); // Call your API function to fetch profile
    navigateTo(`/ussdMenus/${data.value.id}`);
    console.log("New ussd menu data; ", data.value);
    toast({
      title: "Ussd Menu Created",
      description: "Ussd Menu created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new ussd menu:", err.message);
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
      <h1 class="md:text-2xl text-lg font-medium">Create New Ussd Menu</h1>
      <p class="text-sm text-muted-foreground">
        Create new ussd menu by including menu name, visible, display order
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="menuName">
              <FormItem>
                <FormLabel>Menu Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter menu name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="displayOrder">
              <FormItem>
                <FormLabel>Display Order </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter display order"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.visible"
              v-slot="{ value, handleChange }"
              name="visible"
            >
              <FormItem>
                <FormLabel>Visible </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
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
