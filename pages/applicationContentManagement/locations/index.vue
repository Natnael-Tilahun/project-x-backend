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

const locations = ref<
  { name: string; type: string; latitude: number; longitude: number }[]
>([
  {
    name: "Piassa",
    type: "branch",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Mexico",
    type: "branch",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Legehar",
    type: "branch",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Piassa",
    type: "atm",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Mexico",
    type: "atm",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Kera",
    type: "atm",
    latitude: 9.005401,
    longitude: 38.763611,
  },
  {
    name: "Jemo",
    type: "atm",
    latitude: 9.005401,
    longitude: 38.763611,
  },
]);
const isSubmitting = ref(false);

const form = useForm({
  initialValues: {
    name: "",
    type: "branch", // Default type
    latitude: 0, // Changed from null to 0
    longitude: 0, // Changed from null to 0
  },
});

const onSubmit = form.handleSubmit(
  async (values: {
    name: string;
    type: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      isSubmitting.value = true;
      locations.value.push({
        name: values.name,
        type: values.type,
        latitude: values.latitude, // Removed parseFloat
        longitude: values.longitude, // Removed parseFloat
      });
      toast({
        title: "Location Added",
        description: "Location added successfully",
      });
      form.resetForm(); // Reset the form after submission
    } catch (err) {
      console.error("Error adding Location:", err);
    } finally {
      isSubmitting.value = false;
    }
  }
);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div>
      <h1 class="md:text-2xl text-lg font-medium">Locations Setter</h1>
      <p class="text-sm text-muted-foreground">
        Add new branch or ATM locations by entering the details below.
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-1 gap-6">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel> Location Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter Location Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="type">
              <FormItem>
                <FormLabel> Location Type </FormLabel>
                <FormControl>
                  <UiSelect v-bind="componentField">
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select Location Type" />
                    </UiSelectTrigger>
                    <UiSelectContent>
                      <UiSelectItem value="branch">Branch</UiSelectItem>
                      <UiSelectItem value="atm">ATM</UiSelectItem>
                    </UiSelectContent>
                  </UiSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="latitude">
              <FormItem>
                <FormLabel> Latitude </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter Latitude"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="longitude">
              <FormItem>
                <FormLabel> Longitude </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter Longitude"
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
      <h1 class="md:text-2xl text-lg font-medium">Current Locations</h1>
      <p class="text-sm text-muted-foreground">List of added locations.</p>
    </div>
    <UiCard class="w-full gap-4 p-6">
      <div v-if="locations.length === 0">
        <p class="text-gray-500">No locations currently available.</p>
      </div>
      <UiAccordion
        v-else
        type="single"
        default-value="branches"
        collapsible
        className="w-full space-y-4"
      >
        <UiAccordionItem key="branches" value="branches">
          <UiAccordionTrigger class="w-full bg-secondary p-4 rounded-lg"
            >Branches</UiAccordionTrigger
          >
          <UiAccordionContent class="w-full py-6">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
            >
              <div v-for="(location, index) in locations" :key="index">
                <UiCard
                  v-if="location.type === 'branch'"
                  class="flex flex-col p-4 border rounded-lg shadow-md bg-secondary"
                >
                  <div class="flex items-center justify-between w-full mb-2">
                    <div class="flex items-center">
                      <Icon
                        name="mdi:store"
                        class="h-6 w-6 mr-2 text-blue-500"
                      />
                      <h2 class="font-semibold text-lg">{{ location.name }}</h2>
                    </div>
                    <p class="text-sm text-muted-foreground">
                      Type: {{ location.type }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 w-full">
                    <p class="text-sm text-muted-foreground">
                      Latitude: {{ location.latitude }}
                    </p>
                    <span class="text-sm text-muted-foreground">|</span>
                    <p class="text-sm text-muted-foreground">
                      Longitude: {{ location.longitude }}
                    </p>
                  </div>
                </UiCard>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
        <UiAccordionItem key="atm" value="atm">
          <UiAccordionTrigger class="w-full bg-secondary p-4 rounded-lg"
            >ATMs</UiAccordionTrigger
          >
          <UiAccordionContent class="w-full py-6">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
            >
              <div v-for="(location, index) in locations" :key="index">
                <UiCard
                  v-if="location.type === 'atm'"
                  class="flex flex-col p-4 border rounded-lg shadow-md bg-secondary"
                >
                  <div class="flex items-center justify-between w-full mb-2">
                    <div class="flex items-center">
                      <Icon name="mdi:atm" class="h-6 w-6 mr-2 text-blue-500" />
                      <h2 class="font-semibold text-lg">{{ location.name }}</h2>
                    </div>
                    <p class="text-sm text-muted-foreground">
                      Type: {{ location.type }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 w-full">
                    <p class="text-sm text-muted-foreground">
                      Latitude: {{ location.latitude }}
                    </p>
                    <span class="text-sm text-muted-foreground">|</span>
                    <p class="text-sm text-muted-foreground">
                      Longitude: {{ location.longitude }}
                    </p>
                  </div>
                </UiCard>
              </div>
            </div>
          </UiAccordionContent>
        </UiAccordionItem>
      </UiAccordion>
    </UiCard>
  </div>
</template>
