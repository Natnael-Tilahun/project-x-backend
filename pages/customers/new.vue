<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newCustomerformSchema } from "~/validations/newCustomerformSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
const { createNeweCustomer, isLoading } = useCustomers();
const isError = ref(false);
const data = ref<Customer>();
const isSubmitting = ref(false);
const image = ref();

const form = useForm({
  validationSchema: newCustomerformSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    data.value = await createNeweCustomer(values); // Call your API function to fetch profile
    navigateTo(`/customers/customerDetails/${data.value.id}`);
    console.log("New Customer data; ", data.value);
    toast({
      title: "Customer Created",
      description: "Customer created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    image.value = URL.createObjectURL(file);
    // form.setFieldValue("imageUrl", image.value);
    console.log("imalge: ", image.value);
  }
};

//  // Create a URL for the binary data
//  const url = URL.createObjectURL(blob);
//       setImageUrl(url);
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Customer</h1>
      <p class="text-sm text-muted-foreground">
        Create new customer by including phone, core customer id, email and
        language
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="phone">
              <FormItem>
                <FormLabel> Phone </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer phone number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel> Email </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer email address"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="nationalId">
              <FormItem>
                <FormLabel> National Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter national Id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- <FormField v-slot="{ componentField }" name="coreCustomerId">
              <FormItem>
                <FormLabel> Core Customer Id </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter core customer Id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->

            <!-- <FormField v-slot="{ componentField }" name="imageUrl">
              <FormItem>
                <FormLabel> Image </FormLabel>
                <FormControl>
                  <UiInput
                    type="file"
                    accept="image/png, image/jpeg"
                    placeholder="Enter image"
                    @change="handleFileChange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->

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
