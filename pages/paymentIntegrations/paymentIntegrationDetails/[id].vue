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
import {
  PaymentIntegrationType,
  TransactionAmountType,
  Visibility,
} from "@/global-types";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";

const route = useRoute();
const {
  getPaymentIntegrationById,
  updatePaymentIntegration,
  isSubmitting,
  isLoading,
} = usePaymentIntegrations();

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
const categoryMenus = ref<Menu[]>([]);
const selectedCategoryMenus = ref<Menu[]>([]);
const { getMenus } = useMenus();

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
    loading.value = true;
    const data = {
      ...values,
      categoryMenus: values?.categoryMenus
        ? values?.categoryMenus?.map((menu: any) => ({ id: menu }))
        : [],
    };
    console.log("values: ", data);
    data.value = await updatePaymentIntegration(values.id, data); // Call your API function to fetch profile
    // form.setValues(data.value);
    openItems.value = "paymentOperations";
    toast({
      title: "Payment Integration Updated",
      description: "Payment Integration updated successfully",
    });
    loading.value = false;
  } catch (err: any) {
    console.error("Error updating payment integration:", err);
    isError.value = true;
  } finally {
    loading.value = false;
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
    isLoading.value = true;
    loading.value = true;
    data.value = await getPaymentIntegrationById(integrationId.value);
    form.setValues(data.value);
    selectedCategoryMenus.value = data.value?.categoryMenus || [];
    console.log("data.value: ", data.value);
    loading.value = false;
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const fetchMenus = async () => {
  categoryMenus.value = await getMenus();
};

await useAsyncData("menus", async () => {
  await fetchMenus();
});

await useAsyncData("paymentIntegrationData", async () => {
  await getPaymentIntegrationData();
});

const refetch = async () => {
  await getPaymentIntegrationData();
};
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <div
      class="flex flex-col justify-center items-center gap-3 border p-5 bg-background rounded-xl"
    >
      <h1 class="md:text- items-center font-bold">
        {{ data?.integrationName }}
      </h1>
    </div>

    <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="IntegrationDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'IntegrationDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl"
        >
          Payment Integration Details
        </UiTabsTrigger>
        <UiTabsTrigger
          value="paymentOperations"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'paymentOperations',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl"
        >
          Payment Operations
        </UiTabsTrigger>
        <UiTabsTrigger
          value="configurePaymentOperations"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'configurePaymentOperations',
              },
            })
          "
          :disabled="openItems != 'configurePaymentOperations'"
          :class="openItems == 'configurePaymentOperations' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl"
        >
          {{ operationName }}
        </UiTabsTrigger>
        <UiTabsTrigger
          value="newPaymentOperation"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newPaymentOperation',
              },
            })
          "
          :disabled="openItems != 'newPaymentOperation'"
          :class="openItems == 'newPaymentOperation' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-2xl"
        >
          New Payment Operation
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="IntegrationDetails"
        class="text-base bg-background p-6 rounded-lg"
      >
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField
              :model-value="data?.id"
              v-slot="{ componentField }"
              name="id"
            >
              <FormItem>
                <FormLabel> ID </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="id"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
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
            <FormField
              :model-value="data?.iconPath"
              v-slot="{ componentField }"
              name="iconPath"
            >
              <FormItem>
                <FormLabel> Icon Path </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter icon path"
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
              :model-value="data?.currencyCode"
              v-slot="{ componentField }"
              name="currencyCode"
            >
              <FormItem>
                <FormLabel> Currency Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter currency code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
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
              :model-value="data?.integrationType"
              v-slot="{ componentField }"
              name="integrationType"
            >
              <FormItem>
                <FormLabel> Integration Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        :placeholder="
                          data?.integrationType
                            ? data?.integrationType
                            : 'Select a integration type'
                        "
                      />
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
                        :placeholder="
                          data?.transactionAmountType
                            ? data?.transactionAmountType
                            : 'Select a transaction amount type'
                        "
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
              :model-value="data?.visiblity"
              v-slot="{ componentField }"
              name="visiblity"
            >
              <FormItem>
                <FormLabel> Visiblity </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        :placeholder="
                          data?.visiblity
                            ? data?.visiblity
                            : 'Select a visibility'
                        "
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <FormMessage />
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
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.categoryMenus"
              v-slot="{ componentField, errorMessage }"
              name="categoryMenus"
            >
              <FormItem>
                <FormLabel> Category Menus </FormLabel>
                <UiPopover>
                  <UiPopoverTrigger asChild>
                    <FormControl>
                      <div
                        variant="outline"
                        role="combobox"
                        class="w-full text-sm text-left border h-10 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                        :class="{
                          'text-muted-foreground':
                            !selectedCategoryMenus?.length,
                        }"
                      >
                        {{
                          selectedCategoryMenus?.length
                            ? selectedCategoryMenus
                                .map((menu) => menu.menuName)
                                .join(", ")
                            : "Select category menus"
                        }}
                        <Icon
                          name="material-symbols:unfold-more-rounded"
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        ></Icon>
                      </div>
                    </FormControl>
                  </UiPopoverTrigger>
                  <UiPopoverContent class="w-[200px] p-0">
                    <UiCommand>
                      <UiCommandInput placeholder="Search category menu..." />
                      <UiCommandList>
                        <UiCommandEmpty>
                          No category menu found.
                        </UiCommandEmpty>
                        <UiCommandGroup>
                          <UiCommandItem
                            :disabled="true"
                            v-for="menu in categoryMenus"
                            :key="menu.id"
                            :value="menu.menuName"
                            @select="
                              () => {
                                const isSelected = selectedCategoryMenus.some(
                                  (selected) => selected.id === menu.id
                                );

                                if (isSelected) {
                                  selectedCategoryMenus =
                                    selectedCategoryMenus.filter(
                                      (selected) => selected.id !== menu.id
                                    );
                                } else {
                                  selectedCategoryMenus.push(menu);
                                }

                                // Update the form value with the array of menu IDs
                                form.setFieldValue(
                                  'categoryMenus',
                                  selectedCategoryMenus.map((menu) => menu.id)
                                );
                              }
                            "
                          >
                            {{ menu.menuName }}
                            <UiCheckbox
                              :disabled="true"
                              :checked="
                                selectedCategoryMenus.some(
                                  (selected) => selected.id === menu.id
                                )
                              "
                              class="ml-auto"
                            />
                          </UiCommandItem>
                        </UiCommandGroup>
                      </UiCommandList>
                    </UiCommand>
                  </UiPopoverContent>
                </UiPopover>
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
              :model-value="data?.isSingleFormPayment"
              v-slot="{ value, handleChange }"
              name="isSingleFormPayment"
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

                Update
              </UiButton>
            </div>
          </div>
        </form>
      </UiTabsContent>

      <UiTabsContent
        value="paymentOperations"
        class="text-base bg-background p-6 rounded-lg"
      >
        <PaymentIntegrationsPaymentOperations />
      </UiTabsContent>

      <UiTabsContent
        value="configurePaymentOperations"
        class="text-base bg-background py-0 rounded-lg"
      >
        <PaymentOperationsConfigurations />
      </UiTabsContent>

      <UiTabsContent
        value="newPaymentOperation"
        class="text-base bg-background py-6 rounded-lg"
      >
        <PaymentOperationsNewPaymentOperation :integrationId="integrationId" />
      </UiTabsContent>
    </UiTabs>
  </div>
</template>

<style lang="css" scoped></style>
