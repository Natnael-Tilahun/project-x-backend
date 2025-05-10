<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { chargeFormSchema } from "~/validations/chargeFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { ChargeType } from "@/global-types";
import type { Charge } from "~/types";

const { createNewCharge, isLoading } = await useCharges();
const isError = ref(false);
const data = ref<Charge>();

const isSubmitting = ref(false);
const activeTab = ref<string>("roleDetails"); // Reactive variable to manage active tab

const form = useForm({
  validationSchema: chargeFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    data.value = await createNewCharge(values); // Call your API function to fetch profile
    navigateTo(`/charges/${data.value.id}`);
    toast({
      title: "New Charge Created",
      description: "Charge created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new charge:", err);
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
      <h1 class="md:text-2xl text-lg font-medium">Add New Charges</h1>
      <p class="text-sm text-muted-foreground">Create new charge</p>
    </div>

    <UiCard
      default-value="roleDetails"
      :model-value="activeTab"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="chargeId">
              <FormItem class="w-full">
                <FormLabel> Charge Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Charge Id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="type">
              <FormItem class="w-full">
                <FormLabel>Charge Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a charge type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(ChargeType)"
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

            <FormField v-slot="{ componentField }" name="description">
              <FormItem class="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Application  Description"
                    class="resize-y"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="shortDescription">
              <FormItem class="w-full">
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter a Short  Description"
                    class="resize-y"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="categoryAccount">
              <FormItem class="w-full">
                <FormLabel>Category Account</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Category Account"
                    v-bind="componentField"
                  />
                </FormControl>
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
