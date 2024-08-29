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

const messages = ref<{ title: string; message: string }[]>([
  {
    title: "Mobile banking app out of service",
    message:
      "Dear Customer, Our mobile application will be out of service from 2:00 AM - 3:00 AM due to system upgrade. Thank you for your understanding.",
  },
]);
const isSubmitting = ref(false);

const form = useForm({
  initialValues: {
    title: "",
    message: "",
  },
});

const onSubmit = form.handleSubmit(
  async (values: { title: string; message: string }) => {
    try {
      isSubmitting.value = true;
      messages.value.push({ title: values.title, message: values.message });
      toast({
        title: "Message Added",
        description: "Service outage message added successfully",
      });
      form.resetForm(); // Reset the form after submission
    } catch (err) {
      console.error("Error adding message:", err);
    } finally {
      isSubmitting.value = false;
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">Service Outage Messages</h1>
      <p class="text-sm text-muted-foreground">
        Add new service outage messages by entering the title and message below.
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
                    placeholder="Enter message title"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="message">
              <FormItem>
                <FormLabel> Message </FormLabel>
                <FormControl>
                  <UiTextarea
                    type="text"
                    placeholder="Enter service outage message"
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
      <h1 class="md:text-2xl text-lg font-medium">Current Messages</h1>
      <p class="text-sm text-muted-foreground">
        List of service outage messages.
      </p>
    </div>
    <UiCard
      class="w-full flex border-[1px] rounded-lg h-full text-sm md:text-base p-6"
    >
      <template v-if="messages.length === 0">
        <p class="text-gray-500">No messages currently available.</p>
      </template>
      <template v-else>
        <UiAccordion type="single" default-value="item-1" collapsible>
          <UiAccordionItem
            v-for="(msg, index) in messages"
            :key="index"
            :value="`item-${index}`"
          >
            <UiAccordionTrigger class="md:text-lg flex-row-reverse gap-2">
              <p class="mr-auto md:text-xl">{{ msg.title }}</p>
            </UiAccordionTrigger>
            <UiAccordionContent class="w-full border-none">
              <p>{{ msg.message }}</p>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </template>
    </UiCard>
  </div>
</template>
