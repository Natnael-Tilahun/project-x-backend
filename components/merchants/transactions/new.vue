<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newMerchantBranchFormSchem } from "~/validations/newMerchantBranchFormSchem";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { getIdFromPath, splitPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";
import type { MerchantBranch, MerchantOperatorRole } from "~/types";

const { createNeweMerchantBranch } = useMerchantBranchs();
const isError = ref(false);
const loading = ref(false);
const data = ref<MerchantBranch>();
const merchantId = ref<string>("");
const isSubmitting = ref(false);

merchantId.value = getIdFromPath();

const form = useForm({
  validationSchema: newMerchantBranchFormSchem,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const updatedData = {
      ...data.value,
      ...values,
      address: {
        city: values?.address?.city || null,
        businessEmail: values?.address?.businessEmail || null,
        postalNumber: values?.address?.postalNumber || null,
      },
    };
    data.value = await createNeweMerchantBranch(merchantId.value, updatedData);
    form.setValues({
      ...data.value,
      city: data.value?.address?.city || null,
      businessEmail: data.value?.address?.businessEmail || null,
      postalNumber: data.value?.address?.postalNumber || null,
    });
    navigateTo(`/merchants/${merchantId.value}?activeTab=merchantBranches`);
    toast({
      title: "Branch Created",
      description: "Merchant branch created successfully",
    });
  } catch (err: any) {
    console.error("Error creating branch:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="branchName">
              <FormItem class="w-full">
                <FormLabel> Branch Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter branch name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="branchCode">
              <FormItem class="w-full">
                <FormLabel> Branch Code</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter branch code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="businessPhoneNumber">
              <FormItem class="w-full">
                <FormLabel> Business Phone Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter business phone number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="paymentReceivingAccountNumber"
            >
              <FormItem class="w-full">
                <FormLabel>Payment Receiving Account Number</FormLabel>
                <FormControl>
                  <UiInput
                    placeholder="Enter payment receiving account number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem class="w-full">
                <FormLabel>Fax Number</FormLabel>
                <FormControl>
                  <UiInput
                    placeholder="Enter fax number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="city">
              <FormItem>
                <FormLabel>City </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
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
                    disabled
                    placeholder="Enter business email"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="postalNumber">
              <FormItem>
                <FormLabel>Postal Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter postal number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <UiPermissionGuard
              :permission="PermissionConstants.UPDATE_APPLICATION_VERSION"
            >
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

                  Update
                </UiButton>
              </div>
            </UiPermissionGuard>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>
