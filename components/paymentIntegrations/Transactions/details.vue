<script setup lang="ts">
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { formatAccountNumber } from "~/lib/formatAccountNumber";
import type { ThirdPartyTransactionDetail } from "~/types";

const route = useRoute();
const { getTransactionsDetailsByTransactionId } = usePaymentIntegrations();
const isLoading = ref(false);
const transactionData = ref<ThirdPartyTransactionDetail | null>(null);
const transactionId = ref<string | null>(null);

try {
  isLoading.value = true;
  transactionId.value = route.query.transactionId as string;
  transactionData.value = await getTransactionsDetailsByTransactionId(transactionId.value);
} catch (error) {
  console.error("Error fetching transaction details:", error);
} finally {
  isLoading.value = false;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const reversalHandler = () => {
  toast({
    title: "Not implimented yet."
  })
}
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full flex items-center justify-between">

    <div class="pt-4">
      <h1 class="md:text-2xl text-lg font-medium">Transaction Details</h1>
      <p class="text-sm text-muted-foreground">View transaction information</p>
    </div>
    <UiButton @click="reversalHandler">Reverse</UiButton>
  </div>

    <UiCard v-if="isLoading" class="p-6 ">
      <div class="grid md:grid-cols-2 gap-6 ">
        <UiSkeleton v-for="n in 8" :key="n" class="h-16 w-full" />
      </div>
    </UiCard>

    <UiCard v-else-if="transactionData" class="p-6 grid lg:grid-cols-2 gap-8 w-full">
      <div class="md:col-span-2 md:grid grid-cols-2 gap-x-8 gap-y-4 w-full">

        <PaymentIntegrationsTransactionsTransactionDetailItem label="Transaction Id" :value="transactionData.id" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Core Transaction Id" :value="transactionData.coreTransactionId" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Mb Transaction Id" :value="transactionData.mbTransactionId" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Legacy Id" :value="transactionData.legacyId" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Debit Account Number"
        :value="(transactionData.debitAccountNumber	)" />
        <NuxtLink @click="
          navigateTo({
            path: `/customers/${transactionData.customerId}`
          })
          " class="w-full text-primary font-semibold cursor-pointer">
          <PaymentIntegrationsTransactionsTransactionDetailItem label="Customer Id"
            :value="transactionData.customerId" />
        </NuxtLink>
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Credit Account Number"
          :value="(transactionData.creditAccountNumber)" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Amount" :value="transactionData.amount" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Minimum Amount"
          :value="transactionData.minimumAmount" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Maximum Amount"
          :value="transactionData.maximumAmount" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Notify Status" :status=true
          :value="transactionData.notifyStatus" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Enquiry Status" :status=true
          :value="transactionData.enquiryStatus" />
          <PaymentIntegrationsTransactionsTransactionDetailItem
            label="Created Date"
            :value="transactionData.createdDate ? new Date(transactionData?.createdDate).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'"
          />
          <PaymentIntegrationsTransactionsTransactionDetailItem
            label="Last Modified Date"
            :value="transactionData.lastModifiedDate	 ? new Date(transactionData?.lastModifiedDate	).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'"
          />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Computed Payment Detail"
          :value="transactionData.computedPaymentDetail" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Computed Payment Detail Short"
          :value="transactionData.computedPaymentDetailShort" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Computed Confirmation Template"
          :value="transactionData.computedConfirmationTemplate" />

        <PaymentIntegrationsTransactionsTransactionDetailItem label="Computed Payment Completed Message"
          :value="transactionData.computedPaymentCompletedMessage" />
        <PaymentIntegrationsTransactionsTransactionDetailItem label="Computed Payment Completed Message Short"
          :value="transactionData.computedPaymentCompletedMessageShort" />
          <NuxtLink @click="
          navigateTo({
            path: `/integrations/${transactionData.enquiryApiOperationId}`,
            query: {
              activeTab: 'configureOperations',
              operationId: transactionData.enquiryApiOperationId
            },
          })
          " class="w-full text-primary font-semibold cursor-pointer">
          <PaymentIntegrationsTransactionsTransactionDetailItem label="Enquiry Api Operation Id"
          :value="transactionData.enquiryApiOperationId" />
        </NuxtLink>
        <NuxtLink @click="
          navigateTo({
            path: `/paymentIntegrations/${transactionData.paymentIntegrationId}`,
            query: {
              activeTab: 'IntegrationDetails',
            },
          })
          " class="w-full text-primary font-semibold cursor-pointer">
          <PaymentIntegrationsTransactionsTransactionDetailItem label="Payment Integration Id"
            :value="transactionData.paymentIntegrationId" />
        </NuxtLink>

      </div>

      <div
        class="bg-muted rounded-lg p-4 text-sm  w-full overflow-x-auto max-h-[500px] flex flex-col gap-2 col-span-full md:col-span-1">
        <h1>Enquiry Form Data</h1>
        <JsonInspector v-if="transactionData.enquiryFormData" :data="transactionData?.enquiryFormData" />
        <div v-else>No content</div>
      </div>
      <div
        class="bg-muted rounded-lg p-4 text-sm  w-full overflow-x-auto max-h-[500px] flex flex-col gap-2 col-span-full md:col-span-1">
        <h1>Enquiry Api Response Data</h1>
        <JsonInspector v-if="transactionData.enquiryApiResponseData" :data="transactionData?.enquiryApiResponseData" />
        <div v-else>No content</div>
      </div>
      <div
        class="bg-muted rounded-lg p-4 text-sm w-full overflow-x-auto max-h-[500px] flex flex-col gap-2 col-span-full md:col-span-1">
        <h1>Enquiry Api Request And Response Raw</h1>
        <JsonInspector v-if="transactionData.enquiryApiRequestAndResponseRaw"
          :data="transactionData?.enquiryApiRequestAndResponseRaw" />
        <div v-else>No content</div>
      </div>
      <div
        class="bg-muted rounded-lg p-4 text-sm overflow-x-auto max-h-[500px] w-full flex flex-col gap-2 col-span-full md:col-span-1">
        <h1>Equiry Api Payload Data</h1>
        <JsonInspector v-if="transactionData.enquiryApiPayloadData" :data="transactionData?.enquiryApiPayloadData" />
        <div v-else>No content</div>
      </div>
    </UiCard>

    <UiCard v-else class="p-6">
      <p class="text-center text-muted-foreground">Transaction not found.</p>
    </UiCard>
  </div>


</template>
