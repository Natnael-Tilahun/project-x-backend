<script lang="ts" setup>
import { ref } from "vue";
import { getIdFromPath } from "~/lib/utils";
import { PermissionConstants } from "~/constants/permissions";
import type {  MerchantTransaction } from "~/types";
const { getMerchantTransactionById } = useMerchantTransactions();

const isError = ref(false);
const loading = ref(false);
const transactionData = ref<MerchantTransaction>();
const merchantId = ref<string>("");
const transactionId = ref<string>("");
const route = useRoute();
merchantId.value = getIdFromPath();
transactionId.value = route.query.transactionId;

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};


const fetchTransactionData = async () => {
  try {
    isError.value = false;
    loading.value = true;
    transactionData.value = await getMerchantTransactionById(merchantId.value, transactionId.value);
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
      v-else-if="transactionData && !isError"
      class="w-full flex border-[1px] rounded-lg h-full p-6 grid lg:grid-cols-5 gap-8"
    >
    <div class="w-full   lg:col-span-2 ">
        <MerchantsTransactionsTransactionDetail :transactionDetails="transactionData"  />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:col-span-3  gap-6 w-full">
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Transaction Id"
          :value="transactionData.merchantTransactionId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Id"
          :value="transactionData.merchantId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Name"
          :value="transactionData.merchantName"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant City"
          :value="transactionData.merchantCity"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Branch Id"
          :value="transactionData.merchantBranchId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Branch Name"
          :value="transactionData.merchantBranchName"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Operator Id"
          :value="transactionData.operatorId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Operator Name"
          :value="transactionData.operatorName"
        />

        <MerchantsTransactionsTransactionDetailItem
          label="Amount"
          :value="transactionData.amount + ' ' + transactionData.currencyCode"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Currency Code"
          :value="transactionData.currencyCode"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="PaymentReference"
          :value="transactionData.paymentReference"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Tip Amount"
          :value="transactionData.tipAmount"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Dynamic Id"
          :value="transactionData.dynamicId"
        />

        <MerchantsTransactionsTransactionDetailItem
          label="Transaction Status"
          :value="transactionData.paymentStatus"
          :status="true"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Expiration Date"
          :value="formatDate(transactionData.expirationDate)"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Transaction Initiator"
          :value="transactionData.transactionInitiator"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="MbTransaction Id"
          :value="transactionData.mbTransactionId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Core Transaction Id"
          :value="transactionData.coreTransactionId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Merchant Account Number"
          :value="transactionData.merchantAccountNumber"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Payer AccountNumber"
          :value="transactionData.payerAccountNumber"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Payer Id"
          :value="transactionData.payerId"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Payer Name"
          :value="transactionData.payerName"
        />
        <MerchantsTransactionsTransactionDetailItem
          label="Payer Phone"
          :value="transactionData.payerPhone"
        />
      </div>
      <!-- <div class="text-sm md:text-base p-6 basis-full ">
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
      </div> -->
    </UiCard>
    <div v-else-if="transactionData == null || transactionData == undefined">
      <UiNoResultFound title="Sorry, No transaction found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
