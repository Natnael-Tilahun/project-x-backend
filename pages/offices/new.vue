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
import { newOfficeFormSchema } from "~/validations/newOfficeFormSchema";
import type { Office } from "~/types";
const { createNewOffice, isLoading } = useOffice();
const { getOffices } = useOffice();
const isError = ref(false);
const data = ref<Office>();
const isSubmitting = ref(false);
const loading = ref(false);

const form = useForm({
  validationSchema: newOfficeFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    console.log("values: ", values);
    data.value = await createNewOffice(values); // Call your API function to fetch profile
    navigateTo(`/offices/${data.value.id}`);
    console.log("New office data; ", data.value);
    toast({
      title: "Office Created",
      description: "Office created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new office:", err.message);
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
      <h1 class="md:text-2xl text-lg font-medium">Create New Office</h1>
      <p class="text-sm text-muted-foreground">
        Create new staff by including Name, code, state, origanizational region, distric name and opening date.
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Office Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter office name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="code">
              <FormItem>
                <FormLabel>Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter office code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="state">
              <FormItem>
                <FormLabel>State </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter state"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="organizationRegion">
              <FormItem>
                <FormLabel> Organization Region </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter organization region"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="districtName">
              <FormItem>
                <FormLabel> District Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter district name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormLabel> Description </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="hierarchy">
              <FormItem>
                <FormLabel>Hierarchy </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter hierarchy"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="openingDate">
              <FormItem>
                <FormLabel> Opening Date </FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter opening date"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="parent">
              <FormItem>
                <FormLabel>Parent</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter parent"
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
