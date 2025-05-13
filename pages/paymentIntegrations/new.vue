<script lang="ts" setup>
import { watch } from "vue"; // Import watch from Vue
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
import { columns } from "~/components/operations/columns";
import {
  PaymentIntegrationType,
  TransactionAmountType,
  Visibility,
  MaximumAmountVariableType,
  MinimumAmountVariableType,
  CreditAccountNumberVariableType,
  PaymentCategory,
} from "@/global-types";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import type { Charge, PaymentIntegration } from "~/types";
import ChargeSelect from "~/components/charges/ChargeSelect.vue";   

const route = useRoute();
const {
  getPaymentIntegrationById,
  updatePaymentIntegration,
  createNewPaymentIntegration,
  isSubmitting,
  isLoading,
} = usePaymentIntegrations();
const {getCharges, isLoading:isChargeLoading} = useCharges()

const openItems = ref("serviceDefinition");
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const paymentIntegrationId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<PaymentIntegration>();
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "serviceDefinition";
const chargesData = ref<Charge[]>([])
const paymentIntegrationName = ref<string>("Create New Payment Integration");

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
  console.log("values: ", values);
  try {
    loading.value = true;
    const newValues = {
      ...values,
      charge: {
        id: values.charge
      }
    }
    console.log("newValues: ", newValues)
    // data.value = await createNewPaymentIntegration(newValues); // Call your API function to fetch profile
    // form.setValues(data.value);
    // paymentIntegrationId.value = data.value.id;
    // paymentIntegrationName.value = data.value.companyName;
    // // openItems.value = "newOperation";
    // navigateTo({
    //   path: `/paymentIntegrations/${data.value.id}`,
    //   query: {
    //     activeTab: "paymentOperations",
    //   },
    // });

    console.log("Created Payment Integration data; ", data.value);
    toast({
      title: "Payment Integration Created",
      description: "Payment Integration created successfully",
    });
  } catch (err: any) {
    console.error("Error creating payment integration:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const fetchChargeData = async () => {
  try {
  isLoading.value = true;
  loading.value = true;
  chargesData.value = await getCharges(0,100000);
} catch (err) {
  console.error("Error fetching charges:", err);
  isError.value = true;
} finally {
  isLoading.value = false;
  loading.value = false;
}
}

onMounted(() => {
  fetchChargeData();
})

</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <div
      class="flex flex-col justify-center items-center gap-3 border p-5 bg-background rounded-xl"
    >
      <h1 class="md:text- items-center font-bold">
        {{ paymentIntegrationName }}
      </h1>
    </div>

    <UiTabs v-model="openItems" class="py- w-full">
      <UiTabsList class="w-full h-full flex justify-start px-0 pt-5 gap-2">
        <UiTabsTrigger
          value="serviceDefinition"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinition',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl"
        >
          Service Definition
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="serviceDefinition"
        class="text-base bg-background p-6 rounded-lg"
      >
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField
              :model-value="data?.integrationName"
              v-slot="{ componentField }"
              name="integrationName"
            >
              <FormItem>
                <FormLabel> Integration Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter integration name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.companyName"
              v-slot="{ componentField }"
              name="companyName"
            >
              <FormItem>
                <FormLabel> Company Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter company name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="col-span-full">
              <FormField
                :model-value="data?.description"
                v-slot="{ componentField }"
                name="description"
              >
                <FormItem>
                  <FormLabel> Description </FormLabel>
                  <FormControl>
                    <UiTextarea
                      placeholder="Enter Description"
                      class="resize-y col-span-full"
                      rows="0"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div
              v-if="form.values.isImage"
              class="w-full gap-2 grid grid-cols-5"
            >
              <div class="col-span-2 w-full">
                <FormField
                  :model-value="data?.iconPath"
                  v-slot="{ componentField }"
                  name="iconPath"
                >
                  <FormItem>
                    <FormLabel> Icon Path </FormLabel>
                    <FormControl>
                      <UiInput
                        v-bind="componentField"
                        type="text"
                        placeholder="Enter icon path"
                      />
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
                        <UiInput
                          :key="fileInputKey"
                          class="w-full"
                          type="file"
                          accept="image/*"
                          @change="handleFileSelect"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <!-- Image Preview with Remove Button -->
                  <div v-if="imagePreview" class="mt-2 relative group">
                    <button
                      @click="handleRemoveImage"
                      class="group-hover:flex hidden absolute top-2 right-2 bg-red-500 rounded-lg p-1 items-center justify-center shadow-sm"
                    >
                      <Icon name="lucide:x" class="h-6 w-6 text-white" />
                    </button>
                    <img
                      :src="imagePreview"
                      alt="Preview"
                      class="w-full h-60 object-contain rounded-md border"
                    />
                  </div>
                </div>
                <UiButton
                  size="sm"
                  type="button"
                  class="self-en mt-7"
                  :disabled="!selectedFile || uploadLoading"
                  @click="handleUpload"
                >
                  <Icon
                    v-if="uploadLoading"
                    name="svg-spinners:8-dots-rotate"
                    class="mr-2 h-4 w-4 animate-spin"
                  />
                  Upload
                </UiButton>
              </div>
            </div>

            <div v-else class="w-full">
              <FormField v-slot="{ field }" name="iconPath">
                <FormItem>
                  <FormLabel>Icon Path</FormLabel>
                  <FormControl>
                    <IconPicker
                      :model-value="field.value"
                      @update:modelValue="field.onChange"
                      @select="field.onChange"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField
              :model-value="data?.defaultLanguageCode"
              v-slot="{ componentField }"
              name="defaultLanguageCode"
            >
              <FormItem>
                <FormLabel> Default Language Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default language code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.currencyCode"
              v-slot="{ componentField }"
              name="currencyCode"
            >
              <FormItem>
                <FormLabel> Currency Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter account number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
                :model-value="data?.dailyLimitPerAccount"
                v-slot="{ componentField }"
                name="dailyLimitPerAccount"
              >
                <FormItem>
                  <FormLabel> Daily Limit Per Account </FormLabel>
                  <FormControl>
                    <UiInput
                      type="number"
                      placeholder="Enter daily limit per account"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.limitPerTransaction"
                v-slot="{ componentField }"
                name="limitPerTransaction"
              >
                <FormItem>
                  <FormLabel> Limit Per Transaction </FormLabel>
                  <FormControl>
                    <UiInput
                      type="number"
                      placeholder="Enter limit per transaction"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            <FormField
              :model-value="data?.integrationType"
              v-slot="{ componentField }"
              name="integrationType"
            >
              <FormItem>
                <FormLabel> Integration Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a integration type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(PaymentIntegrationType)"
                        :key="item"
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

            <FormField
                :model-value="data?.category"
                v-slot="{ componentField }"
                name="category"
              >
                <FormItem>
                  <FormLabel> Category </FormLabel>
                  <UiSelect v-bind="componentField">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue
                          :placeholder="
                            data?.category
                              ? data?.category
                              : 'Select a category'
                          "
                        />
                      </UiSelectTrigger>
                    </FormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem
                          v-for="(displayValue, enumKey) in PaymentCategory"
                          :key="enumKey"
                          :value="enumKey"
                        >
                          {{ displayValue }}
                        </UiSelectItem>
                      </UiSelectGroup>
                    </UiSelectContent>
                  </UiSelect>
                  <FormMessage />
                </FormItem>
              </FormField>


            <FormField
              :model-value="data?.transactionAmountType"
              v-slot="{ componentField }"
              name="transactionAmountType"
            >
              <FormItem>
                <FormLabel> Transaction Amount Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select a transaction amount type"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(TransactionAmountType)"
                        :key="item"
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

            <FormField
              v-if="
                form.values.transactionAmountType ==
                TransactionAmountType.USER_DEFINED
              "
              :model-value="data?.maximumAmountVariableType"
              v-slot="{ componentField }"
              name="maximumAmountVariableType"
            >
              <FormItem>
                <FormLabel> Maximum Amount Variable Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        :placeholder="
                          data?.maximumAmountVariableType
                            ? data?.maximumAmountVariableType
                            : 'Select a maximum amount variable type'
                        "
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(MaximumAmountVariableType)"
                        :key="item"
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
            <FormField
              v-if="
                form.values.maximumAmountVariableType ==
                  MaximumAmountVariableType.FIXED &&
                form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
              "
              :model-value="data?.maximumAmount"
              v-slot="{ componentField }"
              name="maximumAmount"
            >
              <FormItem>
                <FormLabel> Maximum Amount </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter maximum amount"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-if="
                form.values.transactionAmountType ==
                TransactionAmountType.USER_DEFINED
              "
              :model-value="data?.minimumAmountVariableType"
              v-slot="{ componentField }"
              name="minimumAmountVariableType"
            >
              <FormItem>
                <FormLabel> Minimum Amount Variable Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        :placeholder="
                          data?.minimumAmountVariableType
                            ? data?.minimumAmountVariableType
                            : 'Select a minimum amount variable type'
                        "
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(MinimumAmountVariableType)"
                        :key="item"
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
            <FormField
              v-if="
                form.values.minimumAmountVariableType ==
                  MinimumAmountVariableType.FIXED &&
                form.values.transactionAmountType ==
                  TransactionAmountType.USER_DEFINED
              "
              :model-value="data?.minimumAmount"
              v-slot="{ componentField }"
              name="minimumAmount"
            >
              <FormItem>
                <FormLabel> Minimum Amount </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter minimum amount"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.creditAccountNumberVariableType"
              v-slot="{ componentField }"
              name="creditAccountNumberVariableType"
            >
              <FormItem>
                <FormLabel> Credit Account Number Variable Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        :placeholder="
                          data?.creditAccountNumberVariableType
                            ? data?.creditAccountNumberVariableType
                            : 'Select a credit account number variable type'
                        "
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(
                          CreditAccountNumberVariableType
                        )"
                        :key="item"
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
            <FormField
              v-if="
                form.values.creditAccountNumberVariableType ==
                CreditAccountNumberVariableType.FIXED
              "
              :model-value="data?.accountNumber"
              v-slot="{ componentField }"
              name="accountNumber"
            >
              <FormItem>
                <FormLabel> Account Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter account number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.visiblity"
              v-slot="{ componentField }"
              name="visiblity"
            >
              <FormItem>
                <FormLabel> Visibility </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a visibility" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(Visibility)"
                        :key="item"
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

            <FormField
              v-slot="{ componentField }"
              name="charge"
            >
              <FormItem>
                <FormLabel>Charge</FormLabel>
                <ChargeSelect
                  v-bind="componentField"
                  :charges="chargesData"
                />
                <FormMessage />
              </FormItem>
            </FormField>


            <FormField
              :model-value="data?.defaultPaymentReason"
              v-slot="{ componentField }"
              name="defaultPaymentReason"
            >
              <FormItem>
                <FormLabel> Default Payment Reason </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default payment reason"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentConfirmationTemplate"
              v-slot="{ componentField }"
              name="paymentConfirmationTemplate"
            >
              <FormItem>
                <FormLabel> Payment Confirmation Template </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Confirmation Template"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentConfirmationTemplateShort"
              v-slot="{ componentField }"
              name="paymentConfirmationTemplateShort"
            >
              <FormItem>
                <FormLabel> Payment Confirmation Template Short </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Confirmation Template Short"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentDetailTemplate"
              v-slot="{ componentField }"
              name="paymentDetailTemplate"
            >
              <FormItem>
                <FormLabel> Payment Detail Template </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Detail Template"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentDetailTemplateShort"
              v-slot="{ componentField }"
              name="paymentDetailTemplateShort"
            >
              <FormItem>
                <FormLabel> Payment Detail Template Short </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Detail Template Short"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentSuccessTemplate"
              v-slot="{ componentField }"
              name="paymentSuccessTemplate"
            >
              <FormItem>
                <FormLabel> Payment Success Template </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Success Template"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentSuccessTemplateShort"
              v-slot="{ componentField }"
              name="paymentSuccessTemplateShort"
            >
              <FormItem>
                <FormLabel> Payment Success Template Short </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Success Template Short"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentErrorTemplate"
              v-slot="{ componentField }"
              name="paymentErrorTemplate"
            >
              <FormItem>
                <FormLabel> Payment Error Template </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Error Template"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.paymentErrorTemplateShort"
              v-slot="{ componentField }"
              name="paymentErrorTemplateShort"
            >
              <FormItem>
                <FormLabel> Payment Error Template Short </FormLabel>
                <FormControl>
                  <UiTextarea
                    placeholder="Enter Payment Error Template Short"
                    class="resize-y col-span-full"
                    rows="0"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.isDraft"
              v-slot="{ value, handleChange }"
              name="isDraft"
            >
              <FormItem>
                <FormLabel> Is Draft </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.enabled"
              v-slot="{ value, handleChange }"
              name="enabled"
            >
              <FormItem>
                <FormLabel> Enabled </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.isImage"
              v-slot="{ value, handleChange }"
              name="isImage"
            >
              <FormItem>
                <FormLabel> Is Image </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.confirmRecipientIdentity"
              v-slot="{ value, handleChange }"
              name="confirmRecipientIdentity"
            >
              <FormItem>
                <FormLabel> Confirm Recipient Identity </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              :model-value="data?.reEnquirePaymentDetailBeforePayment"
              v-slot="{ value, handleChange }"
              name="reEnquirePaymentDetailBeforePayment"
            >
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

            <FormField
              :model-value="data?.singleFormPayment"
              v-slot="{ value, handleChange }"
              name="singleFormPayment"
            >
              <FormItem>
                <FormLabel> Single Form Payment </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="col-span-full w-full py-4 flex justify-between">
              <UiButton
                :disabled="loading"
                variant="outline"
                type="button"
                size="lg"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <UiButton :disabled="loading" size="lg" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="loading"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Save
              </UiButton>
            </div>
          </div>
        </form>
      </UiTabsContent>

      <UiTabsContent
        value="operations"
        class="text-base bg-white p-6 rounded-lg"
      >
        <div v-if="isLoading" class="py-10 flex justify-center w-full">
          <UiLoading />
        </div>
        <div v-else-if="data" class="py-5 flex flex-col space-y-10 mx-auto">
          <UiButton
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'newOperation',
                },
              })
            "
            class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Configure New</UiButton
          >
          <UiDataTable :columns="columns" :data="data?.apiOperations">
            <template v-slot:toolbar="{ table }"> </template>
          </UiDataTable>
        </div>
        <div v-if="isError">
          <ErrorMessage :retry="refetch" title="Something went wrong." />
        </div>
      </UiTabsContent>

      <UiTabsContent
        value="configurePaymentOperations"
        class="text-base bg-background py-6 rounded-lg"
      >
        <OperationsConfigurations />
      </UiTabsContent>

      <UiTabsContent
        value="newOperation"
        class="text-base bg-background py-6 rounded-lg"
      >
        <OperationsNewOperation :integrationId="integrationId" />
      </UiTabsContent>
    </UiTabs>
  </div>
</template>
