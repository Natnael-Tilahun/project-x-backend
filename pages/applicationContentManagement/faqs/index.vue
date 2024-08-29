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

const faqs = ref<{ question: string; answer: string }[]>([]);
const isSubmitting = ref(false);

const form = useForm({
  initialValues: {
    question: "",
    answer: "",
  },
});

const onSubmit = form.handleSubmit(
  async (values: { question: string; answer: string }) => {
    try {
      isSubmitting.value = true;
      faqs.value.push({ question: values.question, answer: values.answer });
      toast({
        title: "FAQ Added",
        description: "FAQ added successfully",
      });
      form.resetForm(); // Reset the form after submission
    } catch (err) {
      console.error("Error adding FAQ:", err);
    } finally {
      isSubmitting.value = false;
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">FAQ Setter</h1>
      <p class="text-sm text-muted-foreground">
        Add new FAQs by entering the question and answer below.
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-1 gap-6">
            <FormField v-slot="{ componentField }" name="question">
              <FormItem>
                <FormLabel> Question </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter FAQ question"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="answer">
              <FormItem>
                <FormLabel> Answer </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter FAQ answer"
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
      <h1 class="md:text-2xl text-lg font-medium">Current FAQs</h1>
      <p class="text-sm text-muted-foreground">List of FAQs.</p>
    </div>
    <UiCard
      class="w-full flex border-[1px] rounded-lg h-full text-sm md:text-base p-6"
    >
      <template v-if="faqs.length === 0">
        <p class="text-gray-500">No FAQs currently available.</p>
      </template>
      <template v-else>
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem
            v-for="(faq, index) in faqs"
            :key="index"
            :value="`item-${index}`"
          >
            <UiAccordionTrigger class="md:text-lg flex-row-reverse gap-2">
              <p class="mr-auto md:text-xl">{{ faq.question }}</p>
            </UiAccordionTrigger>
            <UiAccordionContent class="w-full border-none">
              <p>{{ faq.answer }}</p>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </template>
    </UiCard>
  </div>
</template>
