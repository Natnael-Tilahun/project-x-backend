<script lang="ts" setup>
import { watch, onBeforeUnmount } from "vue"; // Import watch and onBeforeUnmount from Vue
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { usePaymentIntegrations } from "~/composables/usePaymentIntegrations";
import { paymentIntegrationFormSchema } from "~/validations/paymentIntegrationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PaymentIntegrationType,
  TransactionAmountType,
  MaximumAmountVariableType,
  MinimumAmountVariableType,
  CreditAccountNumberVariableType,
  Visibility,
  PaymentCategory,
  LimitType,
  VisibilityScope,
} from "@/global-types";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { useDocuments } from "~/composables/useDocuments";
import type { PaymentIntegration, ApiOperation, Charge, Customer } from "~/types";
import ChargeSelect from "~/components/charges/ChargeSelect.vue";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getPaymentIntegrationById,
  updatePaymentIntegration,
  isSubmitting,
  isLoading,
} = usePaymentIntegrations();
const { uploadFile, getFile } = useDocuments(); // Get the upload function
const { getCharges, isLoading: isChargeLoading } = useCharges()
const { getCoreCustomerByAccountNumber } = useCustomers()

const openItems = ref("IntegrationDetails");
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<PaymentIntegration>();
const apiOperationsData = ref<ApiOperation>();
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id;
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "IntegrationDetails";
const operationName = ref<string>("Configure Payment Operations");
// Add this ref for the preview
const imagePreview = ref(null);
const selectedFile = ref(null);
const uploadLoading = ref(false);
const chargesData = ref<Charge[]>([])
const accountsInfoData = ref<Customer>()
const openEditModal = ref(false);
const pendingUpdateData = ref<any>(null);

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
}

// Add a ref for the file input
const fileInput = ref(null);

const fileInputKey = ref(0); // Add this ref for forcing input recreation

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);

const form = useForm<PaymentIntegration>({
  validationSchema: paymentIntegrationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    // loading.value = true;
    // Prepare the data as before
    const dataToUpdate = {
      ...values,
      maximumAmount:
        values?.maximumAmountVariableType == MaximumAmountVariableType.FIXED &&
          values?.transactionAmountType == TransactionAmountType.USER_DEFINED
          ? values?.maximumAmount
          : null,
      minimumAmount:
        values?.minimumAmountVariableType == MinimumAmountVariableType.FIXED &&
          values?.transactionAmountType == TransactionAmountType.USER_DEFINED
          ? values?.minimumAmount
          : null,
    };
    pendingUpdateData.value = dataToUpdate; // Save for confirmation
    if (values?.accountNumber && values?.accountNumber != data.value?.accountNumber) {
      await fetchAccountsInfoData(values?.accountNumber); // This can throw if invalid
    }
    else {
      confirmUpdatePaymentIntegration();
    }
  } catch (err: any) {
    console.error("Error preparing update:", err);
    isError.value = true;
  } finally {
    // loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const displayApiDataOnLabel = (data: any) => {
  if (data == null || data == "") {
    return "-";
  }
  if (data == false) {
    return "false";
  }
  if (data == true) {
    return "true";
  }
  return data; // Default case if customerActivated is undefined or any other value
};

const getPaymentIntegrationData = async () => {
  try {
    loading.value = true;
    data.value = await getPaymentIntegrationById(integrationId.value);
    form.setValues(data.value);
    if (data.value?.iconPath && data.value.isImage) {
      await getUploadedImage(data.value?.iconPath);
    }
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getPaymentIntegrationData();
});

const refetch = async () => {
  isError.value = false;
  await getPaymentIntegrationData();
};

// Modified file selection handler
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Add upload handler
const handleUpload = async () => {
  if (!selectedFile.value) {
    toast({
      title: "No file selected",
      description: "Please select an image to upload",
      variant: "destructive",
    });
    return;
  }

  try {
    uploadLoading.value = true;
    const response = await uploadFile(
      selectedFile.value,
      integrationId.value,
      "PAYMENT_INTEGRATION"
    );
    // Update the form's iconPath with the uploaded file's ID/path
    form.setFieldValue("iconPath", response.id); // Adjust according to your API response structure
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });

    // Clear the file input
    selectedFile.value = null;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast({
      title: "Error",
      description: "Failed to upload image",
      variant: "destructive",
    });
  } finally {
    uploadLoading.value = false;
  }
};

const getUploadedImage = async (iconPath) => {
  try {
    const response = await getFile(iconPath, "PAYMENT_INTEGRATION");

    // Handle blob response
    if (response instanceof Blob) {
      imagePreview.value = URL.createObjectURL(response);
    }
    // Handle base64 response
    else if (typeof response === "string" && response.startsWith("data:")) {
      imagePreview.value = response;
    }
    // Handle raw base64 (without data URI prefix)
    else if (typeof response === "string") {
      imagePreview.value = `data:image/jpeg;base64,${response}`;
    }
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

// Modify remove handler to also revoke object URL if it exists
const handleRemoveImage = () => {
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = null;
  selectedFile.value = null;
  fileInputKey.value++;
  form.setFieldValue("iconPath", ""); // Adjust according to your API response structure
};

// Clean up object URL when component is unmounted
onBeforeUnmount(() => {
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
});

// Call getUploadedImage when component mounts or when data changes
watch(
  () => data.value?.iconPath,
  (newIconPath) => {
    if (newIconPath) {
      getUploadedImage(newIconPath);
    }
  }
);

const fetchChargeData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    chargesData.value = await getCharges(0, 1000000);
  } catch (err) {
    console.error("Error fetching charges:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
}

// Fetch all merchant accounts
const fetchAccountsInfoData = async (accountNumber: string) => {
  try {
    loading.value = true;
    isError.value = false;
    if (accountNumber) {
      const result = await getCoreCustomerByAccountNumber(accountNumber);
      accountsInfoData.value = result ? result : null;
      console.log("accountsInfoData:", accountsInfoData.value);
      setOpenEditModal(true); // Show confirmation dialog
    }
  } catch (err) {
    isError.value = true;
    console.error("Error fetching accounts info:", err);
    setOpenEditModal(false);
  } finally {
    loading.value = false;
  }
};

const confirmUpdatePaymentIntegration = async () => {
  if (!pendingUpdateData.value) return;
  try {
    loading.value = true;
    data.value = await updatePaymentIntegration(pendingUpdateData.value.id, pendingUpdateData.value);
    openItems.value = "paymentOperations";
    toast({
      title: "Payment Integration Updated",
      description: "Payment Integration updated successfully",
    });
    setOpenEditModal(false); // Close dialog
    await refetch();
  } catch (err: any) {
    console.error("Error updating payment integration:", err);
    isError.value = true;

  } finally {
    loading.value = false;
    pendingUpdateData.value = null;
  }
};


onMounted(() => {
  fetchChargeData();
})
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <div class="flex flex-col justify-center items-center gap-3 border p-2 bg-background rounded-xl">
      <h1 class="md:text-sm items-center font-bold">
        {{ data?.integrationName }}
      </h1>
    </div>

    <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0">
        <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_INTEGRATION>
          <UiTabsTrigger value="IntegrationDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'IntegrationDetails',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Payment Integration Details
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_OPERATION>
          <UiTabsTrigger value="paymentOperations" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'paymentOperations',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Payment Operations
          </UiTabsTrigger>
          <UiTabsTrigger value="configurePaymentOperations" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'configurePaymentOperations',
              },
            })
            " :disabled="openItems != 'configurePaymentOperations'"
            :class="openItems == 'configurePaymentOperations' ? '' : 'hidden'"
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            {{ operationName }}
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.CREATE_PAYMENT_OPERATION>
          <UiTabsTrigger value="newPaymentOperation" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newPaymentOperation',
              },
            })
            " :disabled="openItems != 'newPaymentOperation'"
            :class="openItems == 'newPaymentOperation' ? '' : 'hidden'"
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl">
            New Payment Operation
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_INTEGRATION>
          <UiTabsTrigger value="IntegrationTransactions" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'IntegrationTransactions',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Integration Transactions
          </UiTabsTrigger>
          <UiTabsTrigger value="transactionDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'transactionDetails',
              },
            })
            " :disabled="openItems != 'transactionDetails'" :class="openItems == 'transactionDetails' ? '' : 'hidden'"
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Transaction Details
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiTabsTrigger value="CustomerGroups" v-if="data?.visibilityScope != 'PUBLIC'" @click="
          navigateTo({
            path: route.path,
            query: {
              activeTab: 'CustomerGroups',
            },
          })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
          Allowed Customer Groups
        </UiTabsTrigger>
      </UiTabsList>

      <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_INTEGRATION>
        <UiTabsContent value="IntegrationDetails" class="text-base bg-background p-6 rounded-lg">
          <div v-if="loading" class="py-10 flex justify-center w-full">
            <UiLoading />
          </div>
          <div v-else-if="data && !isError">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <FormField :model-value="data?.id" v-slot="{ componentField }" name="id">
                  <FormItem>
                    <FormLabel> ID </FormLabel>
                    <FormControl>
                      <UiInput type="text" disabled placeholder="id" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.alternateId" v-slot="{ componentField }" name="alternateId">
                  <FormItem>
                    <FormLabel> Alternate ID </FormLabel>
                    <FormControl>
                      <UiInput type="text" disabled placeholder="Enter alternate id" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.integrationName" v-slot="{ componentField }" name="integrationName">
                  <FormItem>
                    <FormLabel> Integration Name </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter integration name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.companyName" v-slot="{ componentField }" name="companyName">
                  <FormItem>
                    <FormLabel> Company Name </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter company name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div v-if="form.values.isImage" class="w-full gap-2 grid grid-cols-5">
                  <div class="col-span-2 w-full">
                    <FormField :model-value="data?.iconPath" v-slot="{ componentField }" name="iconPath">
                      <FormItem>
                        <FormLabel> Icon Path </FormLabel>
                        <FormControl>
                          <UiInput v-bind="componentField" type="text" placeholder="Enter icon path" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="col-span-3 flex gap-2 w-full">
                    <div>
                      <FormField name="uploadIcon">
                        <FormItem>
                          <FormLabel> Upload Icon </FormLabel>
                          <FormControl>
                            <UiInput :key="fileInputKey" class="w-full" type="file" accept="image/*"
                              @change="handleFileSelect" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                      <!-- Image Preview with Remove Button -->
                      <div v-if="imagePreview" class="mt-2 relative group">
                        <button @click="handleRemoveImage"
                          class="group-hover:flex hidden absolute top-2 right-2 bg-red-500 rounded-lg p-1 items-center justify-center shadow-sm">
                          <Icon name="lucide:x" class="h-6 w-6 text-white" />
                        </button>
                        <img :src="imagePreview" alt="Preview" class="w-full h-60 object-contain rounded-md border" />
                      </div>
                    </div>
                    <UiButton size="sm" type="button" class="self-en mt-7" :disabled="!selectedFile || uploadLoading"
                      @click="handleUpload">
                      <Icon v-if="uploadLoading" name="svg-spinners:8-dots-rotate" class="mr-2 h-4 w-4 animate-spin" />
                      Upload
                    </UiButton>
                  </div>
                </div>

                <div v-else class="w-full">
                  <FormField v-slot="{ field }" name="iconPath">
                    <FormItem>
                      <FormLabel>Icon Path</FormLabel>
                      <FormControl>
                        <IconPicker :model-value="field.value" @update:modelValue="field.onChange"
                          @select="field.onChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="col-span-full">
                  <FormField :model-value="data?.description" v-slot="{ componentField }" name="description">
                    <FormItem>
                      <FormLabel> Description </FormLabel>
                      <FormControl>
                        <UiTextarea placeholder="Enter Description" class="resize-y col-span-full" rows="0"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <FormField :model-value="data?.defaultLanguageCode" v-slot="{ componentField }"
                  name="defaultLanguageCode">
                  <FormItem>
                    <FormLabel> Default Language Code {{ form.values.limitType }} </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter default language code" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.currencyCode" v-slot="{ componentField }" name="currencyCode">
                  <FormItem>
                    <FormLabel> Currency Code </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter currency code" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.limitType" v-slot="{ componentField }" name="limitType">
                  <FormItem>
                    <FormLabel> Limit Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select a limit type" />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(LimitType)" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="form.values.limitType == LimitType.LIMITED" :model-value="data?.dailyLimitPerAccount"
                  v-slot="{ componentField }" name="dailyLimitPerAccount">
                  <FormItem>
                    <FormLabel> Daily Limit Per Account </FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter daily limit per account" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="form.values.limitType == LimitType.LIMITED" :model-value="data?.limitPerTransaction"
                  v-slot="{ componentField }" name="limitPerTransaction">
                  <FormItem>
                    <FormLabel> Limit Per Transaction </FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter limit per transaction" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="form.values.limitType == LimitType.LIMITED" :model-value="data?.maxTransactionsPerDay"
                  v-slot="{ componentField }" name="maxTransactionsPerDay">
                  <FormItem>
                    <FormLabel> Max Transactions Per Day </FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter max transactions per day" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.integrationType" v-slot="{ componentField }" name="integrationType">
                  <FormItem>
                    <FormLabel> Integration Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.integrationType
                              ? data?.integrationType
                              : 'Select a integration type'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(
                            PaymentIntegrationType
                          )" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.category" v-slot="{ componentField }" name="category">
                  <FormItem>
                    <FormLabel> Category </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.category
                              ? data?.category
                              : 'Select a category'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="(displayValue, enumKey) in PaymentCategory" :key="enumKey"
                            :value="enumKey">
                            {{ displayValue }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.transactionAmountType" v-slot="{ componentField }"
                  name="transactionAmountType">
                  <FormItem>
                    <FormLabel> Transaction Amount Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.transactionAmountType
                              ? data?.transactionAmountType
                              : 'Select a transaction amount type'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(TransactionAmountType)" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="
                  form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
                " :model-value="data?.maximumAmountVariableType" v-slot="{ componentField }"
                  name="maximumAmountVariableType">
                  <FormItem>
                    <FormLabel> Maximum Amount Variable Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.maximumAmountVariableType
                              ? data?.maximumAmountVariableType
                              : 'Select a maximum amount variable type'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(
                            MaximumAmountVariableType
                          )" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="
                  form.values.maximumAmountVariableType ==
                  MaximumAmountVariableType.FIXED &&
                  form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
                " :model-value="data?.maximumAmount" v-slot="{ componentField }" name="maximumAmount">
                  <FormItem>
                    <FormLabel> Maximum Amount </FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter maximum amount" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="
                  form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
                " :model-value="data?.minimumAmountVariableType" v-slot="{ componentField }"
                  name="minimumAmountVariableType">
                  <FormItem>
                    <FormLabel> Minimum Amount Variable Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.minimumAmountVariableType
                              ? data?.minimumAmountVariableType
                              : 'Select a minimum amount variable type'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(
                            MinimumAmountVariableType
                          )" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="
                  form.values.minimumAmountVariableType ==
                  MinimumAmountVariableType.FIXED &&
                  form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
                " :model-value="data?.minimumAmount" v-slot="{ componentField }" name="minimumAmount">
                  <FormItem>
                    <FormLabel> Minimum Amount </FormLabel>
                    <FormControl>
                      <UiInput type="number" placeholder="Enter minimum amount" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.creditAccountNumberVariableType" v-slot="{ componentField }"
                  name="creditAccountNumberVariableType">
                  <FormItem>
                    <FormLabel> Credit Account Number Variable Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.creditAccountNumberVariableType
                              ? data?.creditAccountNumberVariableType
                              : 'Select a credit account number variable type'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(
                            CreditAccountNumberVariableType
                          )" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-if="
                  form.values.creditAccountNumberVariableType ==
                  CreditAccountNumberVariableType.FIXED
                " :model-value="data?.accountNumber" v-slot="{ componentField }" name="accountNumber">
                  <FormItem>
                    <FormLabel> Account Number </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter account number" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.visibilityScope" v-slot="{ componentField }" name="visibilityScope">
                  <FormItem>
                    <FormLabel> Visibility Scope</FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue :placeholder="data?.visibilityScope
                              ? data?.visibilityScope
                              : 'Select a visibility scope'
                            " />
                        </UiSelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem v-for="item in Object.values(VisibilityScope)" :key="item" :value="item">
                            {{ item }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.chargeId" v-slot="{ componentField }" name="chargeId">
                  <FormItem>
                    <FormLabel>Charge</FormLabel>
                    <ChargeSelect v-bind="componentField" :charges="chargesData" />
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.defaultPaymentReason" v-slot="{ componentField }"
                  name="defaultPaymentReason">
                  <FormItem>
                    <FormLabel> Default Payment Reason </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter default payment reason" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentConfirmationTemplate" v-slot="{ componentField }"
                    name="paymentConfirmationTemplate">
                    <FormItem>
                      <FormLabel> Payment Confirmation Template </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentConfirmationTemplateShort" v-slot="{ componentField }"
                    name="paymentConfirmationTemplateShort">
                    <FormItem>
                      <FormLabel> Payment Confirmation Template Short </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentDetailTemplate" v-slot="{ componentField }"
                    name="paymentDetailTemplate">
                    <FormItem>
                      <FormLabel> Payment Detail Template </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentDetailTemplateShort" v-slot="{ componentField }"
                    name="paymentDetailTemplateShort">
                    <FormItem>
                      <FormLabel> Payment Detail Template Short </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentSuccessTemplate" v-slot="{ componentField }"
                    name="paymentSuccessTemplate" class="col-span-full">
                    <FormItem>
                      <FormLabel> Payment Success Template </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <div class="w-full col-span-full">
                  <FormField :model-value="data?.paymentSuccessTemplateShort" v-slot="{ componentField }"
                    name="paymentSuccessTemplateShort">
                    <FormItem>
                      <FormLabel> Payment Success Template Short </FormLabel>
                      <FormControl>
                        <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div class="w-full col-span-full">
                <FormField :model-value="data?.paymentErrorTemplate" v-slot="{ componentField }"
                  name="paymentErrorTemplate">
                  <FormItem>
                    <FormLabel> Payment Error Template </FormLabel>
                    <FormControl>
                      <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                </div>

                <div class="w-full col-span-full">
                <FormField :model-value="data?.paymentErrorTemplateShort" v-slot="{ componentField }"
                  name="paymentErrorTemplateShort">
                  <FormItem>
                    <FormLabel> Payment Error Template Short </FormLabel>
                    <FormControl>
                      <PaymentIntegrationsPaymentIntegrationTemplateEditor :payment-integration="data"
                          v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                </div>

                <FormField :model-value="data?.coreTransactionReasonTemplate" v-slot="{ componentField }"
                  name="coreTransactionReasonTemplate">
                  <FormItem>
                    <FormLabel> Core Banking Narative</FormLabel>
                    <FormControl>
                      <UiTextarea placeholder="Enter Payment core banking narative" class="resize-y col-span-full"
                        rows="0" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.isDraft" v-slot="{ value, handleChange }" name="isDraft">
                  <FormItem>
                    <FormLabel> Is Draft </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.enabled" v-slot="{ value, handleChange }" name="enabled">
                  <FormItem>
                    <FormLabel> Enabled </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.isImage" v-slot="{ value, handleChange }" name="isImage">
                  <FormItem>
                    <FormLabel> Is Image </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.confirmRecipientIdentity" v-slot="{ value, handleChange }"
                  name="confirmRecipientIdentity">
                  <FormItem>
                    <FormLabel> Confirm Recipient Identity </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.reEnquirePaymentDetailBeforePayment" v-slot="{ value, handleChange }"
                  name="reEnquirePaymentDetailBeforePayment">
                  <FormItem>
                    <FormLabel>
                      Re-Enquire Payment Detail Before Payment
                    </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.singleFormPayment" v-slot="{ value, handleChange }"
                  name="singleFormPayment">
                  <FormItem>
                    <FormLabel> Single Form Payment </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <UiPermissionGuard :permission="PermissionConstants.UPDATE_PAYMENT_INTEGRATION">
                  <div class="col-span-full w-full py-4 flex justify-between">
                    <UiButton :disabled="loading" variant="outline" type="button" size="lg" @click="$router.go(-1)">
                      Cancel
                    </UiButton>
                    <UiButton :disabled="loading" size="lg" type="submit">
                      <Icon name="svg-spinners:8-dots-rotate" v-if="loading" class="mr-2 h-4 w-4 animate-spin"></Icon>

                      Update
                    </UiButton>
                  </div>
                </UiPermissionGuard>
              </div>
            </form>
          </div>
          <div v-if="!loading && isError">
            <ErrorMessage :retry="refetch" title="Something went wrong." />
          </div>
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_OPERATION>
        <UiTabsContent value="paymentOperations" class="text-base bg-background p-6 rounded-lg">
          <PaymentIntegrationsPaymentOperations />
        </UiTabsContent>
        <UiTabsContent value="configurePaymentOperations" class="text-base bg-background py-0 rounded-lg">
          <PaymentOperationsConfigurations :integrationDataProps="data" />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.CREATE_PAYMENT_OPERATION>
        <UiTabsContent value="newPaymentOperation" class="text-base bg-background py-6 rounded-lg">
          <PaymentOperationsNewPaymentOperation :integrationId="integrationId" />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.READ_PAYMENT_INTEGRATION>
        <UiTabsContent value="IntegrationTransactions" class="text-base bg-background p-6 rounded-lg">
          <PaymentIntegrationsTransactions />
        </UiTabsContent>
        <UiTabsContent value="transactionDetails" class="text-base bg-background px-6 rounded-lg">
          <PaymentIntegrationsTransactionsDetails transactionDataProps="data" />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiTabsContent value="CustomerGroups" class="space-y-4 py-8">
        <PaymentIntegrationsCustomerGroups />
      </UiTabsContent>
    </UiTabs>
  </div>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure to set this account number as the collection account?
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This will update the account number and set this account number as the collection account for this payment
          integration.
          <br><br>
          <p class="text-base text-muted-foreground font-medium mb-1">
            Account Name: <span class="text-primary font-bold">{{ accountsInfoData?.fullName }}</span>
          </p>
          <p class="text-base text-muted-foreground font-medium mb-1">
            Account Number: <span class="text-primary font-bold">{{ form.values?.accountNumber }}</span>
          </p>
          <p class="text-base text-muted-foreground font-medium mb-1">
            Customer ID: <span class="text-primary font-bold">{{ accountsInfoData?.customerId }}</span>
          </p>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="confirmUpdatePaymentIntegration" :disabled="loading">
          <Icon name="svg-spinners:8-dots-rotate" v-if="loading" class="mr-2 h-4 w-4 animate-spin"></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>

<style lang="css" scoped></style>
