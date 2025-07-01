<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { newMerchantFormSchema } from "~/validations/newMerchantFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Merchant } from "~/types";
import { PermissionConstants } from "~/constants/permissions";
const route = useRoute();
const { getMerchantById, updateMerchant, isLoading, isSubmitting } =
  useMerchants();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const merchantId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);

const isError = ref(false);
const data = ref<Merchant>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
merchantId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: newMerchantFormSchema,
});

try {
  isLoading.value = true;
  loading.value = true;
  data.value = await getMerchantById(merchantId.value);
  let a = {
    ...data.value,
    tradeLicenseIssueDate: new Date(
      data.value.tradeLicenseIssueDate
    ).toDateString(),
  };
  form.setValues(a);
  console.log(
    "merchantId.value data: ",
    new Date(data.value.tradeLicenseIssueDate),
    a
  );
} catch (err) {
  console.error("Error fetching merchant:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    data.value = await updateMerchant(values.merchantId, values); // Call your API function to fetch profile
    navigateTo(`/merchants/${data.value.merchantId}`);
    console.log("New Merchant data; ", data.value);
    toast({
      title: "Merchant Created",
      description: "Merchant created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new merchant:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="merchantId">
            <FormItem>
              <FormLabel>Merchant Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter merchant Id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="businessName">
            <FormItem>
              <FormLabel>Business Name </FormLabel>
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
              <FormLabel>Business Phone Number </FormLabel>
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
          <FormField v-slot="{ componentField }" name="businessNumber">
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
          </FormField>
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
                  disabled
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
              <FormLabel> Trade License Issue Date </FormLabel>
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
          <FormField v-slot="{ componentField }" name="tradeLicenseExpiryDate">
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
          <FormField v-slot="{ componentField }" name="taxPayerExpiryDate">
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
          </FormField>
          <UiPermissionGuard :permission="PermissionConstants.UPDATE_MERCHANT_INFO" >
          <div class="col-span-full w-full py-4 flex justify-between">
            <UiButton
              :disabled="submitting"
              variant="outline"
              type="button"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton :disabled="submitting" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="submitting"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div>
          </UiPermissionGuard>
        </div>
      </form>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No merchant found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
