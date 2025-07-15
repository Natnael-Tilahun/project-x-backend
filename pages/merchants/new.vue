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
import { newMerchantFormSchema } from "~/validations/newMerchantFormSchema";
import type { Merchant } from "~/types";
import { MerchantCategoryCode } from "~/global-types";
const { createNeweMerchant, isLoading } = useMerchants();
const isError = ref(false);
const data = ref<Merchant>();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newMerchantFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const newValues = {
      ...values,
      taxPayerExpiryDate: values.taxPayerExpiryDate ? new Date(values.taxPayerExpiryDate).toISOString(): "",
      taxPayerIssueDate: values.taxPayerIssueDate ? new Date(values.taxPayerIssueDate).toISOString(): "",
      tradeLicenseExpiryDate: values.tradeLicenseExpiryDate ? new Date(values.tradeLicenseExpiryDate).toISOString(): "",
      tradeLicenseIssueDate: values.tradeLicenseIssueDate ? new Date(values.tradeLicenseIssueDate).toISOString(): "",
    }
    data.value = await createNeweMerchant(newValues); // Call your API function to fetch profile
    navigateTo(`/merchants/${data.value.merchantId}`);
    console.log("New Merchant data; ", data.value);
    toast({
      title: "Merchant Created",
      description: "Merchant created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new merchant:", err.message);
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
      <h1 class="md:text-2xl text-lg font-medium">Create New Merchant</h1>
      <p class="text-sm text-muted-foreground">
        Create new merchant by including Business Name, Business Number, Trade
        License Number, core customer id, bussiness email and phone
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="coreAccountNumber">
              <FormItem>
                <FormLabel>Core Account Number <span class="text-red-500">*</span> </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter core account number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="businessName">
              <FormItem>
                <FormLabel>Business Name <span class="text-red-500">*</span>  </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer business Name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="businessPhoneNumber">
              <FormItem>
                <FormLabel>Business Phone Number <span class="text-red-500">*</span>  </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer business phone number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- <FormField v-slot="{ componentField }" name="businessNumber">
              <FormItem>
                <FormLabel> Business Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer business number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <FormField v-slot="{ componentField }" name="businessType">
              <FormItem>
                <FormLabel> Business Type </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter customer business type"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="merchantCategoryCode">
              <FormItem>
                <FormLabel> Merchant Category Code <span class="text-red-500">*</span></FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a merchant category code" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(MerchantCategoryCode)"
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
            <FormField v-slot="{ componentField }" name="city">
              <FormItem>
                <FormLabel> City </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter city"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="businessEmail">
              <FormItem>
                <FormLabel>Business Email </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter business email"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="postalNumber">
              <FormItem>
                <FormLabel> Postal Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter postal number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="shortCode">
              <FormItem>
                <FormLabel> Short Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter short code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem>
                <FormLabel> Fax Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter fax number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="tradeLicenseNumber">
              <FormItem>
                <FormLabel> Trade License Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter trade license number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="tradeLicenseIssueDate">
              <FormItem>
                <FormLabel> Trade License Issue Date  </FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter trade license Issue Date"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="tradeLicenseExpiryDate"
            >
              <FormItem>
                <FormLabel> Trade License Expiry Date </FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter trade license expiry date"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="taxPayerIdNumber">
              <FormItem>
                <FormLabel> Tax Payer Id Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter tax payer id number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="taxPayerIssueDate">
              <FormItem>
                <FormLabel> Tax Payer Issue Date </FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter tax payer issue date"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- <FormField v-slot="{ componentField }" name="taxPayerExpiryDate">
              <FormItem>
                <FormLabel> Tax Payer Expiry Date </FormLabel>
                <FormControl>
                  <UiInput
                    type="date"
                    placeholder="Enter tax payer expiry date"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <!-- <FormField v-slot="{ componentField }" name="defaultPaymentReceivingAccountNumber">
              <FormItem>
                <FormLabel>Default Payment Receiving Account Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default payment receiving account number"
                    v-bind="componentField"
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
