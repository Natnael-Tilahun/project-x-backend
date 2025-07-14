<script lang="ts" setup>
const openItems = ref("merchantDetails");

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { editMerchantFormSchema } from "~/validations/editMerchantFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Account, Merchant } from "~/types";
import { PermissionConstants } from "~/constants/permissions";
import { MerchantCategoryCode, MerchantStatus } from "~/global-types";
const route = useRoute();
const {
  getMerchantById,
  getMerchantAccountsId,
  updateMerchant,
  isLoading,
  isSubmitting,
} = useMerchants();
const { getCoreAccountsByCustomerId } = useCustomers();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const merchantId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const accountsData = ref<Account[]>([]);
const coreCustomerId = ref<string>("");
const selectedAccounts = ref<string[]>([]);
const isUpdatingAccounts = ref(false);
const isError = ref(false);
const data = ref<Merchant>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
merchantId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: editMerchantFormSchema,
});



const fetchMerchantData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    data.value = await getMerchantById(merchantId.value);
    coreCustomerId.value = data.value?.coreCustomerId || ""
    const response = await getMerchantAccountsId(merchantId.value) || []
    selectedAccounts.value =  response && response?.map((account) => account.accountNumber) || []
    let a = {
      ...data.value,
    };
    form.setValues(a);
  } catch (err) {
    console.error("Error fetching merchant:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const fetchSelectedMerchantAccountsData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    isError.value = false;
    const response = await getMerchantAccountsId(merchantId.value) || []
    selectedAccounts.value = response && response?.map((account) => account.accountNumber) || []
  } catch (err) {
    console.error("Error fetching merchant accounts:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

onMounted(async () => {
  // await fetchSelectedMerchantAccountsData();
  await fetchMerchantData();
  // await fetchSelectedMerchantAccountsData()
});

const refetch = async () => {
  isError.value = false;
  // await fetchSelectedMerchantAccountsData();
  await fetchMerchantData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    data.value = await updateMerchant(values.merchantId, values); // Call your API function to fetch profile
    navigateTo(`/merchants/${data.value.merchantId}`);
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


watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
      if (
        newActiveTab == "merchantDetails" ||
        newActiveTab == "merchantOperators" ||
        newActiveTab == "merchantBranches" ||
        newActiveTab == "merchantTransactions" ||
        newActiveTab == "operatorDetails" ||
        newActiveTab == "newOperator" ||
        newActiveTab == "branchDetails" ||
        newActiveTab == "newBranch" ||
        newActiveTab == "merchantTransactions" ||
        newActiveTab == "transactionDetails" 
      ) {
        refetch();
      }
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div v-if="loading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <UiTabs
      v-else-if="data && !isError"
      v-model="openItems"
      class="w-full space-y-0"
    >
      <!-- <div class="w-full flex justify-end mb-4 gap-4 px-6">
        <UiPermissionGuard
          :permission="
            data?.active
              ? PermissionConstants.DEACTIVATE_STAFF
              : PermissionConstants.ACTIVATE_STAFF
          "
        >
          <UiButton
            size="sm"
            @click="handleStaffActivation"
            :disabled="submitting"
            :class="data?.active ? 'bg-red-600' : 'bg-green-600'"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="submitting"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            {{ data?.active ? "Deactivate" : "Activate" }}
          </UiButton>
        </UiPermissionGuard>
      </div> -->
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT">
          <UiTabsTrigger
            value="merchantDetails"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'merchantDetails',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Detail Info
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiTabsTrigger
          value="merchantOperators"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'merchantOperators',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Operators
        </UiTabsTrigger>
        <UiTabsTrigger
          value="operatorDetails"
          :disabled="openItems != 'operatorDetails'"
          :class="openItems == 'operatorDetails' ? '' : 'hidden'"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'operatorDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Detail Info
        </UiTabsTrigger>
        <UiTabsTrigger
          value="newOperator"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newOperator',
              },
            })
          "
          :disabled="openItems != 'newOperator'"
          :class="openItems == 'newOperator' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Operator
        </UiTabsTrigger>

        <!-- <UiPermissionGuard :permission=PermissionConstants.RESET_STAFF > -->
        <UiTabsTrigger
          value="merchantBranches"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'merchantBranches',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Branches
        </UiTabsTrigger>
        <!-- </UiPermissionGuard> -->
        <UiTabsTrigger
          value="branchDetails"
          :disabled="openItems != 'branchDetails'"
          :class="openItems == 'branchDetails' ? '' : 'hidden'"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'branchDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Branch Info
        </UiTabsTrigger>
        <UiTabsTrigger
          value="newBranch"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newBranch',
              },
            })
          "
          :disabled="openItems != 'newBranch'"
          :class="openItems == 'newBranch' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Branch
        </UiTabsTrigger>

        <UiTabsTrigger
          value="merchantTransactions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'merchantTransactions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Transactions
        </UiTabsTrigger>
        <UiTabsTrigger
          value="transactionDetails"
          :disabled="openItems != 'transactionDetails'"
          :class="openItems == 'transactionDetails' ? '' : 'hidden'"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'transactionDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Transaction Details
        </UiTabsTrigger>
      </UiTabsList>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT">
        <UiTabsContent
          value="merchantDetails"
          class="text-base bg-background rounded-lg"
        >
          <UiCard class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <!-- <FormField
                  v-slot="{ componentField }"
                  name="defaultPaymentReceivingAccountNumber"
                >
                  <FormItem>
                    <FormLabel
                      >Default Payment Receiving Account Number
                    </FormLabel>
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
                <FormField
                  v-slot="{ componentField }"
                  name="defaultPaymentReceivingAccountNumber"
                >
                  <FormItem>
                    <FormLabel>
                      Default Payment Receiving Account Number
                      <span class="text-red-500">*</span></FormLabel
                    >
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            placeholder="Select a default payment receiving account number"
                          />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup v-if="selectedAccounts.length > 0">
                          <UiSelectItem
                            v-for="item in selectedAccounts"
                            :value="item"
                          >
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                        <UiSelectGroup v-else>
                          <UiSelectItem value="No accounts found">
                            No accounts found
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
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
                <FormField
                  v-slot="{ componentField }"
                  name="businessPhoneNumber"
                >
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
                <FormField v-slot="{ componentField }" name="merchantLevel">
                  <FormItem>
                    <FormLabel> Merchant Level </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter merchant level"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="status">
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            placeholder="Select a merchant status"
                          />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="item in Object.values(MerchantStatus)"
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
                <FormField
                  v-slot="{ componentField }"
                  name="merchantCategoryCode"
                >
                  <FormItem>
                    <FormLabel>
                      Merchant Category Code
                      <span class="text-red-500">*</span></FormLabel
                    >
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            placeholder="Select a merchant category code"
                          />
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
                <FormField
                  v-slot="{ componentField }"
                  name="tradeLicenseNumber"
                >
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
                <FormField
                  v-slot="{ componentField }"
                  name="tradeLicenseIssueDate"
                >
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
                <FormField
                  v-slot="{ componentField }"
                  name="taxPayerExpiryDate"
                >
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



                <div class="flex flex-col gap-2 w-full">
                  <UiLabel>Merchant Accounts</UiLabel>

                  <UiPermissionGuard
                  :permission="PermissionConstants.UPDATE_MERCHANT"
                >
                  <div class="flex items-center w-full">
                    <UiSheet class="w-full">
                      <UiSheetTrigger class="w-full">
                        <UiButton
                          size="sm"
                          type="button"
                          class="font-medium cursor-pointer px-2  py-1 bg-[#8C2A7C]/15 text-primary hover:bg-[#8C2A7C]/20 w-full"
                        >
                          <Icon name="lucide:shield" class="h-4 w-4 mr-2" />
                          Accounts
                        </UiButton>
                      </UiSheetTrigger>
                      <UiSheetContent
                        class="md:min-w-[75%] sm:min-w-full flex flex-col h-full overflow-y-auto"
                      >
                        <MerchantsAccounts
                          :selectedAccounts="selectedAccounts"
                          :coreCustomerIdProps="coreCustomerId"
                          @refetch="refetch"
                        />
                      </UiSheetContent>
                    </UiSheet>
                  </div>
                </UiPermissionGuard>
                </div>

                <UiPermissionGuard
                  :permission="PermissionConstants.UPDATE_MERCHANT"
                >
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
        </UiTabsContent>
        <UiTabsContent
          value="merchantOperators"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsOperators />
        </UiTabsContent>
        <UiTabsContent
          value="operatorDetails"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsOperatorsDetails />
        </UiTabsContent>
        <UiTabsContent
          value="newOperator"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsOperatorsNew />
        </UiTabsContent>
        <UiTabsContent
          value="merchantBranches"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsBranches />
        </UiTabsContent>
        <UiTabsContent
          value="branchDetails"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsBranchesDetails :accountsData="accountsData" />
        </UiTabsContent>
        <UiTabsContent
          value="newBranch"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsBranchesNew :accountsData="accountsData" />
        </UiTabsContent>
        <UiTabsContent
          value="merchantTransactions"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsTransactions />
        </UiTabsContent>
        <UiTabsContent
          value="transactionDetails"
          class="text-base bg-background rounded-lg"
        >
          <MerchantsTransactionsDetails />
        </UiTabsContent>
      </UiPermissionGuard>
    </UiTabs>
    <div class="w-full" v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No merchant found." />
    </div>
    <div v-else-if="isError" class="w-full">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
