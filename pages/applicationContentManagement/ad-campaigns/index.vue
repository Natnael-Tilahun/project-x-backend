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

const campaigns = ref<{ title: string; description: string; image: string }[]>(
  []
);
const isSubmitting = ref(false);

const form = useForm({
  initialValues: {
    title: "",
    description: "",
    image: null,
  },
});

const onSubmit = form.handleSubmit(
  async (values: {
    title: string;
    description: string;
    image: File | null;
  }) => {
    try {
      isSubmitting.value = true;
      const imageUrl = values.image ? URL.createObjectURL(values.image) : "";
      campaigns.value.push({
        title: values.title,
        description: values.description,
        image: imageUrl,
      });
      toast({
        title: "Ad Campaign Added",
        description: "Ad campaign added successfully",
      });
      form.resetForm(); // Reset the form after submission
    } catch (err) {
      console.error("Error adding Ad Campaign:", err);
    } finally {
      isSubmitting.value = false;
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">Ad Campaigns Setter</h1>
      <p class="text-sm text-muted-foreground">
        Add new ad campaigns by entering the title, description, and image
        below.
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
                    placeholder="Enter Ad Campaign title"
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
                    placeholder="Enter Ad Campaign description"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="image">
              <FormItem>
                <FormLabel> Image </FormLabel>
                <FormControl>
                  <UiInput
                    type="file"
                    accept="image/*"
                    v-bind="componentField"
                    class="w-full object-cover"
                    @change="
                      (event: any) => {
                        form.setFieldValue('image', event.target.files[0]);
                      }
                    "
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
      <h1 class="md:text-2xl text-lg font-medium">Current Ad Campaigns</h1>
      <p class="text-sm text-muted-foreground">List of ad campaigns.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <template v-if="campaigns.length === 0">
        <p class="text-gray-500">No ad campaigns currently available.</p>
      </template>
      <template v-else>
        <UiCard
          v-for="(campaign, index) in campaigns"
          :key="index"
          class="flex flex-col p-2 border rounded-lg shadow-md h-56"
        >
          <h2 class="font-semibold text-sm">{{ campaign.title }}</h2>
          <!-- Adjusted font size -->
          <p class="text-xs text-muted-foreground">
            {{ campaign.description }}
          </p>
          <!-- Adjusted font size -->
          <img
            v-if="campaign.image"
            :src="campaign.image"
            alt="Ad Campaign Image"
            class="mt-2 w-full h-40 rounded"
          />
        </UiCard>
      </template>
    </div>
  </div>
</template>
