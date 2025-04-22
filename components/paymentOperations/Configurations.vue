<script lang="ts" setup>
const openItems = ref("configuration");
import { useForm } from "vee-validate";
import { ref, computed, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { useIntegrations } from "~/composables/useIntegrations";
import { paymentOperationFormSchema } from "~/validations/paymentOperationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PaymentOperationType,
  TransactionAmountType,
  MaximumAmountVariableType,
  MinimumAmountVariableType,
  CreditAccountNumberVariableType,
  PaymentIntegrationType,
} from "@/global-types";

const route = useRoute();
const {
  getPaymentOperations,
  getPaymentOperationById,
  updatePaymentOperation,
  isSubmitting,
  isLoading,
} = usePaymentOperations();
const { getOperations } = useOperations();
const { getPaymentIntegrations, getPaymentIntegrationPaymentOperations } =
  usePaymentIntegrations();
const { getIntegrations } = useIntegrations();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<PaymentOperation>();
const apiOperations = ref<ApiOperation[]>([]);
const apiIntegrations = ref<ApiIntegration[]>([]);
const allPaymentOperations = ref<PaymentOperation[]>([]);
const allPaymentIntegrations = ref<PaymentIntegration[]>([]);
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id;
const activeTab = route.query.activeTab as string;
const operationId = (route.query.operationId as string) || "";
const isPreview = ref<boolean>(false);
const formId = ref<string>("");
const selectedApiIntegration = ref<string>("");
const selectedApiOperations = ref<string[]>([]);

const props = defineProps<{
  integrationDataProps?: PaymentIntegration;
}>();
const integrationData = ref<PaymentIntegration>(props?.integrationDataProps);
console.log("integrationData::", integrationData.value);

const form = useForm<PaymentOperation>({
  validationSchema: paymentOperationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const formData = {
      ...values,
      maximumAmountEnquiryPath:
        integrationData?.maximumAmountVariableType ==
          MaximumAmountVariableType.FIXED &&
        integrationData?.transactionAmountType ==
          TransactionAmountType.USER_DEFINED
          ? values?.maximumAmountEnquiryPath
          : null,
      minimumAmountEnquiryPath:
        integrationData?.minimumAmountVariableType ==
          MinimumAmountVariableType.FIXED &&
        integrationData?.transactionAmountType ==
          TransactionAmountType.USER_DEFINED
          ? values?.minimumAmountEnquiryPath
          : null,
      apiOperation:
        typeof values.apiOperation === "string"
          ? { id: values.apiOperation }
          : values.apiOperation,
      paymentIntegration:
        typeof values.paymentIntegration === "string"
          ? { id: values.paymentIntegration }
          : values.paymentIntegration,
      prevPaymentOperation:
        typeof values.prevPaymentOperation === "string"
          ? { id: values.prevPaymentOperation }
          : values.prevPaymentOperation,
      nextPaymentOperation:
        typeof values.nextPaymentOperation === "string"
          ? { id: values.nextPaymentOperation }
          : values.nextPaymentOperation,
    };
    console.log("formData::", formData);
    const response = await updatePaymentOperation(operationId, formData);
    data.value = response;
    formId.value = response?.form?.id;
    console.log("response::", response);
    // form.setValues({
    //   ...response,
    //   paymentIntegration: response.paymentIntegration?.id,
    //   prevPaymentOperation: response.prevPaymentOperation?.id,
    //   nextPaymentOperation: response.nextPaymentOperation?.id,
    //   apiOperation: response.apiOperation?.id,
    // });
    openItems.value = "form";
    toast({
      title: "Payment Operation Updated",
      description: "Payment Operation updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating payment operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

// const getAllPaymentOperations = async () => {
//   try {
//     allPaymentOperations.value = await getPaymentOperations();
//   } catch (err) {
//     console.error("Error fetching payment operations:", err);
//     isError.value = true;
//   }
// };

// const getPaymentOperationData = async () => {
//   try {
//     loading.value = true;
//     data.value = await getPaymentOperationById(operationId);
//     formId.value = data.value?.form?.id;
//     form.setValues({
//       ...data.value,
//       paymentIntegration: data.value.paymentIntegration?.id,
//       prevPaymentOperation: data.value.prevPaymentOperation?.id,
//       nextPaymentOperation: data.value.nextPaymentOperation?.id,
//       apiOperation: data.value.apiOperation?.id,
//     });
//     loading.value = false;
//   } catch (err) {
//     console.error("Error fetching payment operations:", err);
//     isError.value = true;
//   } finally {
//     loading.value = false;
//   }
// };

// const getApiIntegrationsData = async () => {
//   try {
//     apiIntegrations.value = await getIntegrations(); // Call your API function to fetch roles
//     // Find the API integration that contains the current operation
//     const apiIntegrationWithOperation = apiIntegrations.value.find(
//       (integration) =>
//         integration?.apiOperations?.some(
//           (operation) => operation.id === data.value?.apiOperation?.id
//         )
//     );
//     // Update apiOperations list for the selected integration
//     if (apiIntegrationWithOperation) {
//       // Set the selected API integration
//       selectedApiIntegration.value = apiIntegrationWithOperation?.id;
//       apiOperations.value = apiIntegrationWithOperation.apiOperations;
//     } else {
//       // Set the selected API integration
//       selectedApiIntegration.value = apiIntegrations.value[0]?.id;
//       apiOperations.value = apiIntegrations.value[0]?.apiOperations;
//     }
//   } catch (err) {
//     console.error("Error fetching API integrations:", err);
//     isError.value = true;
//   }
// };

// const getAllPaymentIntegrations = async () => {
//   try {
//     allPaymentIntegrations.value = await getPaymentIntegrations();
//   } catch (err) {
//     console.error("Error fetching payment integrations:", err);
//     isError.value = true;
//   }
// };

const fetchData = async () => {
  isError.value = false;
  try {
    loading.value = true;
    // Fetch only what's needed initially
    [
      apiOperations.value,
      allPaymentOperations.value,
      data.value,
      apiIntegrations.value,
    ] = await Promise.all([
      getOperations(0, 1000).catch(() => []),
      getPaymentIntegrationPaymentOperations(integrationId.value).catch(
        () => []
      ),
      getPaymentOperationById(operationId).catch(() => []),
      getIntegrations(0, 1000).catch(() => []),
    ]);

    selectedApiIntegration.value = apiIntegrations.value[0].id;
    selectedApiOperations.value = apiOperations.value.filter(
      (operation) =>
        operation?.apiIntegration?.id === selectedApiIntegration.value
    );
    route.query.formId = data.value?.form?.id;
    formId.value = data.value?.form?.id;

    // Only fetch these if needed for the current view
    // if (data.value?.paymentIntegration?.id) {
    //   allPaymentOperations.value = await getPaymentOperations();
    //   allPaymentOperations.value = allPaymentOperations.value.filter(
    //     (op) =>
    //       op?.paymentIntegration?.id === data.value?.paymentIntegration?.id
    //   );
    // }
  } catch (error) {
    console.error("Error fetching data:", error);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// await useAsyncData("paymentOperationData", async () => {
//   await fetchData();
//   // getApiIntegrationsData();
//   // getPaymentOperationData();
//   // getAllPaymentIntegrations();
//   // getAllPaymentOperations();
// });

onMounted(async () => {
  await fetchData();
});

const refetch = async () => {
  await fetchData();
  // await getApiIntegrationsData();
  // await getPaymentOperationData();
  // await getAllPaymentOperations();
  // await getAllPaymentIntegrations();
};

const copyToClipboard = (data: any) => {
  navigator.clipboard.writeText(data);
  tooltipText.value = "Copied to clipboard";
  tooltipOpen.value = true;
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};

watch(
  selectedApiIntegration,
  async (newApiIntegrationId) => {
    selectedApiOperations.value = apiOperations.value.filter(
      (operation) => operation?.apiIntegration?.id === newApiIntegrationId
    );
  },
  { immediate: true }
);

const cleanup = () => {
  data.value = undefined;
  apiOperations.value = [];
  apiIntegrations.value = [];
  allPaymentOperations.value = [];
  allPaymentIntegrations.value = [];
};

onBeforeUnmount(cleanup);

// Add a computed property for filtered payment operations
const filteredPaymentOperations = computed(() => {
  const currentType = form.values.paymentOperationType;
  return allPaymentOperations.value.filter(
    (op) => op.paymentOperationType !== currentType
  );
});

// Watch for changes in payment operation type
watch(
  () => form.values.paymentOperationType,
  (newType) => {
    // If the next payment operation has the same type as the new selection, clear it
    if (form.values.nextPaymentOperation) {
      const nextOp = allPaymentOperations.value.find(
        (op) => op.id === form.values.nextPaymentOperation
      );
      if (nextOp?.paymentOperationType === newType) {
        form.setFieldValue("nextPaymentOperation", null);
      }
    }
  }
);
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <div
      v-if="loading"
      class="py-10 flex justify-center items-center w-full h-[500px]"
    >
      <UiLoading />
    </div>
    <form @submit="onSubmit" v-else-if="data && !isError">
      <div class="px-6 pt-4 border-b" value="info">
        <div :key="data?.id" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  readonly="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.name"
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel> Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.description"
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel> Description </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter description"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.paymentOperationType"
            v-slot="{ componentField }"
            name="paymentOperationType"
          >
            <FormItem>
              <FormLabel> Payment Operation Type </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Select a payment operation type"
                    />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in Object.values(PaymentOperationType)"
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
            v-if="
              integrationData?.transactionAmountType ==
              TransactionAmountType.PREDEFINED
            "
            :model-value="data?.amountEnquiryPath"
            v-slot="{ componentField }"
            name="amountEnquiryPath"
          >
            <FormItem>
              <FormLabel> Amount Enquiry Path </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Enter amount enquiry path" />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-if="data?.apiRequestMappingsRegistryOptions"
                      v-for="item in data?.apiRequestMappingsRegistryOptions[
                        '$enquiryApiResponse.'
                      ]"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                    <UiSelectItem v-else
                      >No amount enquiry path found</UiSelectItem
                    >
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>

          <FormField
            v-if="
              integrationData?.transactionAmountType ==
                TransactionAmountType.USER_DEFINED &&
              integrationData?.maximumAmountVariableType ==
                MaximumAmountVariableType.DYNAMIC
            "
            :model-value="data?.maximumAmountEnquiryPath"
            v-slot="{ componentField }"
            name="maximumAmountEnquiryPath"
          >
            <FormItem>
              <FormLabel> Maximum Amount Enquiry Path </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Enter amount enquiry path" />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-if="data?.apiRequestMappingsRegistryOptions"
                      v-for="item in data?.apiRequestMappingsRegistryOptions[
                        '$enquiryApiResponse.'
                      ]"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                    <UiSelectItem v-else
                      >No maximum amount enquiry path found</UiSelectItem
                    >
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>
          <FormField
            v-if="
              integrationData?.transactionAmountType ==
                TransactionAmountType.USER_DEFINED &&
              integrationData?.minimumAmountVariableType ==
                MinimumAmountVariableType.DYNAMIC
            "
            :model-value="data?.minimumAmountEnquiryPath"
            v-slot="{ componentField }"
            name="minimumAmountEnquiryPath"
          >
            <FormItem>
              <FormLabel> Minimum Amount Enquiry Path </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Enter minimum amount enquiry path"
                    />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-if="data?.apiRequestMappingsRegistryOptions"
                      v-for="item in data?.apiRequestMappingsRegistryOptions[
                        '$enquiryApiResponse.'
                      ]"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                    <UiSelectItem v-else
                      >No minimum amount enquiry path found</UiSelectItem
                    >
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>

          <FormField
            v-if="
              integrationData?.creditAccountNumberVariableType ===
              CreditAccountNumberVariableType.DYNAMIC
            "
            :model-value="data?.creditAccountNumberEnquiryPath"
            v-slot="{ componentField }"
            name="creditAccountNumberEnquiryPath"
          >
            <FormItem>
              <FormLabel> Credit Account Number Enquiry Path </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Enter credit account number enquiry path"
                    />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-if="data?.apiRequestMappingsRegistryOptions"
                      v-for="item in data?.apiRequestMappingsRegistryOptions[
                        '$enquiryApiResponse.'
                      ]"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </UiSelectItem>
                    <UiSelectItem v-else
                      >No credit account number enquiry path found</UiSelectItem
                    >
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>
          <FormField
            :model-value="selectedApiIntegration"
            v-slot="{ componentField }"
            name="apiIntegration"
          >
            <FormItem>
              <FormLabel> API Integration </FormLabel>
              <UiSelect
                v-bind="componentField"
                @update:modelValue="(value) => (selectedApiIntegration = value)"
              >
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select an API integration" />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in apiIntegrations"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.apiOperation?.id"
            v-slot="{ componentField }"
            name="apiOperation"
          >
            <FormItem>
              <FormLabel> API Operation </FormLabel>
              <UiSelect :required="integrationData?.integrationType !== PaymentIntegrationType.INTERNAL_TRANSFER" v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select an API operation" />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-if="selectedApiOperations.length > 0"
                      v-for="item in selectedApiOperations"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.operationName }}
                    </UiSelectItem>
                    <UiSelectItem v-else>No API operations found</UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.prevPaymentOperation?.id"
            v-slot="{ componentField }"
            name="prevPaymentOperation"
          >
            <FormItem>
              <FormLabel> Previous Payment Operation </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Select a previous payment operation"
                    />
                  </UiSelectTrigger>
                </FormControl>
                <FormMessage />
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in allPaymentOperations"
                      :key="item.id"
                      :value="item.id"
                      :disabled="true"
                    >
                      {{ item.paymentOperationType }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>
          <FormField
            :model-value="data?.nextPaymentOperation?.id"
            v-slot="{ componentField }"
            name="nextPaymentOperation"
          >
            <FormItem>
              <FormLabel> Next Payment Operation </FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      placeholder="Select a next payment operation"
                    />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in filteredPaymentOperations"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.paymentOperationType }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <FormPropsField
              :model-value="data?.paymentIntegration?.id"
              v-slot="{ componentField }"
              name="paymentIntegration"
            >
              <FormItem>
                <FormLabel> Payment Integration </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholderPropstent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in allPaymentIntegrations"
                        :key="item.id"
                        :value="item.id"
                        :disabled="true"
                      >
                        {{ item.integrationName }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormPropsField> -->
            <UiPermissionGuard permission="UPDATE_PAYMENT_OPERATIONS" >
          <div class="col-span-full w-full py-4 flex justify-end gap-4">
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton :disabled="loading" size="sm" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="loading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div>
          </UiPermissionGuard>
        </div>
      </div>
      <UiTabs defaultValue="form" class="w-full">
        <UiTabsList
          class="w-full flex overflow-x-scroll justify-start px-6 pt-4 pb-0 h-fit gap-2 border-b rounded-t-lg rounded-b-none border-primary bg-background"
        >
          <!-- <UiTabsTrigger
            class="text-lg font-normal min-w-[100px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="info"
            >Info</UiTabsTrigger
          > -->
          <UiTabsTrigger
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            class="text-lg font-normal min-w-[100px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="form"
            >Form</UiTabsTrigger
          >
          <UiTabsTrigger
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            class="text-lg font-normal min-w-[100px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="fields"
            >Fields</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg font-normal min-w-[100px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="mapping"
            >Api request mapping</UiTabsTrigger
          >
        </UiTabsList>

        <UiTabsContent class="p-6" value="mapping">
          <PaymentOperationsMapping
            :operationIdProps="operationId"
            :apiRequestMappingsRegistry="data?.apiRequestMappingsRegistry"
            :apiRequestMappingsRegistryOptions="
              data?.apiRequestMappingsRegistryOptions
            "
          />
        </UiTabsContent>
        <UiTabsContent class="p-6" value="form">
          <PaymentOperationsForms
            @refresh="refetch"
            :operationIdProps="operationId"
          />
        </UiTabsContent>
        <UiTabsContent
          class="text-base h-full px-6 py-4 space-y-2"
          value="fields"
        >
          <PaymentOperationsFields
            :fields="data?.form?.fields"
            :formIdProps="formId"
          />
        </UiTabsContent>
      </UiTabs>
    </form>
    <div v-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
