<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref } from "vue";
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
import type { PaymentOperation, PaymentIntegration, ApiOperation, ApiIntegration } from "~/types";

const openItems = ref("info");
const route = useRoute();
const router = useRouter();
const { createNewPaymentOperation, isLoading } = usePaymentOperations();
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
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id as string;
const activeTab = route.query.activeTab as string;
const operationId = ref<string>("");
const isPreview = ref<boolean>(false);
const formId = ref<string>("");
const { getOperations } = useOperations();
const { getPaymentIntegrations, getPaymentIntegrationPaymentOperations } =
  usePaymentIntegrations();
const { getPaymentOperations } = usePaymentOperations();
const props = defineProps<{
  integrationId: string;
}>();
const selectedApiIntegration = ref<string>("");
const paymentIntegrationData = ref<PaymentIntegration>();
const selectedApiOperations = ref<string[]>([]);

if (props?.integrationId) {
  integrationId.value = props?.integrationId;
}

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);

const form = useForm<PaymentOperation>({
  validationSchema: paymentOperationFormSchema,
});

const getApiOperationsData = async () => {
  try {
    apiOperations.value = await getOperations(); // Call your API function to fetch roles
    console.log("API Operations: ", apiOperations.value);
  } catch (err) {
    console.error("Error fetching API operations:", err);
    isError.value = true;
  }
};

const getAllPaymentOperations = async () => {
  try {
    allPaymentOperations.value = await getPaymentIntegrationPaymentOperations(
      integrationId.value
    );
  } catch (err) {
    console.error("Error fetching payment operations:", err);
    isError.value = true;
  }
};

const getAllPaymentIntegrations = async () => {
  try {
    allPaymentIntegrations.value = await getPaymentIntegrations();
  } catch (err) {
    console.error("Error fetching payment integrations:", err);
    isError.value = true;
  }
};

const getApiIntegrationsData = async () => {
  try {
    apiIntegrations.value = await getIntegrations(); // Call your API function to fetch roles
    selectedApiIntegration.value = apiIntegrations.value[0].id;
    apiOperations.value = apiIntegrations.value[0].apiOperations;
  } catch (err) {
    console.error("Error fetching API integrations:", err);
    isError.value = true;
  }
};

const fetchData = async () => {
  loading.value = true;
  isError.value = false;
  try {
    [
      apiOperations.value,
      allPaymentOperations.value,
      allPaymentIntegrations.value,
      apiIntegrations.value,
    ] = await Promise.all([
      getOperations(0, 10000).catch(() => []),
      getPaymentIntegrationPaymentOperations(integrationId.value).catch(
        () => []
      ),
      getPaymentIntegrations(0,10000).catch(() => []),
      getIntegrations(0, 10000).catch(() => []),
    ]);
    selectedApiIntegration.value = apiIntegrations.value[0].id;
    selectedApiOperations.value = apiOperations.value.filter(
      (operation) =>
        operation?.apiIntegration?.id === selectedApiIntegration.value
    );
    paymentIntegrationData.value = allPaymentIntegrations.value.filter(
      (integration) => integration.id === integrationId.value
    );
    console.log("selectedPaymentIntegrationData", paymentIntegrationData.value);
  } catch (error) {
    isError.value = true;
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

// await useAsyncData("paymentOperationsData", async () => {
//   await getApiOperationsData();
//   await getAllPaymentOperations();
//   await getAllPaymentIntegrations();
// });

await useAsyncData("paymentOperationData", async () => {
  await fetchData();
});

const refetch = async () => {
  await fetchData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const paymentOperationData = {
      ...values,
      paymentIntegration: { id: integrationId.value },
      prevPaymentOperation:
        typeof values.prevPaymentOperation === "string"
          ? { id: values.prevPaymentOperation }
          : values.prevPaymentOperation,
      nextPaymentOperation:
        typeof values.nextPaymentOperation === "string"
          ? { id: values.nextPaymentOperation }
          : values.nextPaymentOperation,
      apiOperation:
        typeof values.apiOperation == "string"
          ? { id: values.apiOperation }
          : values.apiOperation,
      form: values.form ? values.form : null,
      apiRequestMappingsRegistry: values.apiRequestMappingsRegistry
        ? values.apiRequestMappingsRegistry
        : [],
    };
    const response = await createNewPaymentOperation(paymentOperationData); // Call your API function to fetch profile
    data.value = response;
    // formId.value = response.form.id;
    form.setValues({
      ...response,
      prevPaymentOperation: response.prevPaymentOperation?.id,
      nextPaymentOperation: response.nextPaymentOperation?.id,
      apiOperation: response.apiOperation?.id,
    });
    operationId.value = data.value.id;
    router.push(
      `${route.path}?activeTab=configurePaymentOperations&operationId=${operationId.value}`
    );
    openItems.value = "form";
    toast({
      title: "Payment Operation Created",
      description: "Payment Operation created successfully",
    });
  } catch (err: any) {
    console.error("Error creating payment operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

watch(selectedApiIntegration, async (newApiIntegrationId) => {
  selectedApiOperations.value = apiOperations.value.filter(
    (operation) => operation?.apiIntegration?.id === newApiIntegrationId
  );
});
</script>

<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>

  <div v-else-if="!loading && !isError" class="flex flex-col gap-6 items-cente">
    <form @submit="onSubmit">
      <UiTabs v-model="openItems" defaultValue="info" class="w-full">
        <div class="grid grid-cols-2 gap-6 p-6">
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
          <!-- <FormField
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
                    <UiSelectItem disabled v-else
                      >No amount enquiry path found</UiSelectItem
                    >
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField> -->
          <FormField
            v-if="
              paymentIntegrationData?.transactionAmountType ==
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
              paymentIntegrationData?.transactionAmountType ==
                TransactionAmountType.USER_DEFINED &&
              paymentIntegrationData?.maximumAmountVariableType ==
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
              paymentIntegrationData?.transactionAmountType ==
                TransactionAmountType.USER_DEFINED &&
              paymentIntegrationData?.minimumAmountVariableType ==
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
              paymentIntegrationData?.creditAccountNumberVariableType ===
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
              <FormLabel> API Operation</FormLabel>
              <UiSelect :required="paymentIntegrationData?.[0]?.integrationType !== PaymentIntegrationType.INTERNAL_TRANSFER" v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select an API operation" />
                  </UiSelectTrigger>
                </FormControl>
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in selectedApiOperations"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.operationName }}
                    </UiSelectItem>
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
                <UiSelectContent>
                  <UiSelectGroup>
                    <UiSelectItem
                      v-for="item in allPaymentOperations"
                      :value="item.id"
                      :key="item.id"
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
                      v-for="item in allPaymentOperations"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.paymentOperationType }}
                    </UiSelectItem>
                  </UiSelectGroup>
                </UiSelectContent>
              </UiSelect>
            </FormItem>
          </FormField>

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

              Save
            </UiButton>
          </div>
        </div>
        <!-- <UiTabsList
          class="w-full flex justify-start px-0 pb-0 h-fit gap-2 border-b rounded-none border-primary bg-transparent"
        >
          <UiTabsTrigger
            class="text-lg data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="form"
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            >Form</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="fields"
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            >Fields</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="mapping"
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            >Mapping</UiTabsTrigger
          >
        </UiTabsList>
        <UiTabsContent class="p-6" value="mapping">
          <PaymentOperationsMapping
            :operationIdProps="operationId"
            :apiRequestMappingsRegistry="data?.apiRequestMappingsRegistry"
          />
        </UiTabsContent>

        <UiTabsContent class="text-base h-full p-6 space-y-4" value="form">
          <PaymentOperationsForms :operationIdProps="operationId" />
        </UiTabsContent>

        <UiTabsContent class="text-base h-full p-6 space-y-4" value="fields">
          <PaymentOperationsFields />
        </UiTabsContent> -->
      </UiTabs>
    </form>
  </div>
  <div v-else-if="isError" class="flex flex-col gap-6 items-cente">
    <ErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
