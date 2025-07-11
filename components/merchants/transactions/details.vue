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
import { getIdFromPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";
import type { MerchantBranch, MerchantTransaction } from "~/types";
const { getMerchantTransactionById } = useMerchantTransactions();

const isError = ref(false);
const loading = ref(false);
const data = ref<MerchantTransaction>();
const merchantId = ref<string>("");
const transactionId = ref<string>("");
const isSubmitting = ref(false);
const route = useRoute();
merchantId.value = getIdFromPath();
transactionId.value = route.query.transactionId;

const form = useForm({
  validationSchema: newMerchantBranchFormSchem,
});

const fetchTransactionData = async () => {
  try {
    isError.value = false;
    loading.value = true;
    data.value = await getMerchantTransactionById(transactionId.value);
    if (data.value) {
      form.setValues({
        ...data.value,
      });
    }
  } catch (err) {
    console.error("Error fetching transaction", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchTransactionData();
});

const refetch = async () => {
  await fetchTransactionData();
};
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <UiCard
      v-else-if="data && !isError"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
      <div class="text-sm md:text-base p-6 basis-full">
        <form>
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No application found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
