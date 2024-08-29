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

const policies = ref<{ title: string; content: string }[]>([]);
const isSubmitting = ref(false);

const form = useForm({
  initialValues: {
    title: "",
    content: "",
  },
});

const onSubmit = form.handleSubmit(
  async (values: { title: string; content: string }) => {
    try {
      isSubmitting.value = true;
      policies.value.push({ title: values.title, content: values.content });
      toast({
        title: "Privacy Policy Added",
        description: "Privacy policy added successfully",
      });
      form.resetForm(); // Reset the form after submission
    } catch (err) {
      console.error("Error adding Privacy Policy:", err);
    } finally {
      isSubmitting.value = false;
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">Privacy Policy Setter</h1>
      <p class="text-sm text-muted-foreground">
        Add new privacy policies by entering the title and content below.
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-1 gap-6">
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel> Title </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Privacy Policy title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="content">
              <FormItem>
                <FormLabel> Content </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Privacy Policy content"
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

    <div>
      <h1 class="md:text-2xl text-lg font-medium">Current Privacy Policies</h1>
      <p class="text-sm text-muted-foreground">List of privacy policies.</p>
    </div>
    <UiCard
      class="w-full flex border-[1px] rounded-lg h-full text-sm md:text-base p-6"
    >
      <template v-if="policies.length === 0">
        <p class="text-gray-500">No privacy policies currently available.</p>
      </template>
      <template v-else>
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem
            v-for="(policy, index) in policies"
            :key="index"
            :value="`item-${index}`"
          >
            <UiAccordionTrigger class="md:text-lg flex-row-reverse gap-2">
              <p class="mr-auto md:text-xl">{{ policy.title }}</p>
            </UiAccordionTrigger>
            <UiAccordionContent class="w-full border-none">
              <p>{{ policy.content }}</p>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </template>
    </UiCard>
  </div>
</template>
