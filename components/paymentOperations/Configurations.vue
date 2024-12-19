<script lang="ts" setup>
const openItems = ref("configuration");
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
import { PaymentOperationType } from "@/global-types";

const route = useRoute();
const {
  getPaymentOperations,
  getPaymentOperationById,
  updatePaymentOperation,
  isSubmitting,
  isLoading,
} = usePaymentOperations();
const { getOperations } = useOperations();
const { getPaymentIntegrations } = usePaymentIntegrations();
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

console.log("operationId: ", operationId);

const form = useForm<PaymentOperation>({
  validationSchema: paymentOperationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const formData = {
      ...values,
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
    console.log("formData: ", formData);
    const response = await updatePaymentOperation(operationId, formData);
    data.value = response;
    formId.value = response?.form?.id;
    form.setValues({
      ...response,
      paymentIntegration: response.paymentIntegration?.id,
      prevPaymentOperation: response.prevPaymentOperation?.id,
      nextPaymentOperation: response.nextPaymentOperation?.id,
      apiOperation: response.apiOperation?.id,
    });
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

const getAllPaymentOperations = async () => {
  try {
    allPaymentOperations.value = await getPaymentOperations();
  } catch (err) {
    console.error("Error fetching payment operations:", err);
    isError.value = true;
  }
};

const getPaymentOperationData = async () => {
  try {
    loading.value = true;
    data.value = await getPaymentOperationById(operationId);
    formId.value = data.value?.form?.id;
    form.setValues({
      ...data.value,
      paymentIntegration: data.value.paymentIntegration?.id,
      prevPaymentOperation: data.value.prevPaymentOperation?.id,
      nextPaymentOperation: data.value.nextPaymentOperation?.id,
      apiOperation: data.value.apiOperation?.id,
    });
    loading.value = false;
  } catch (err) {
    console.error("Error fetching payment operations:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const getApiIntegrationsData = async () => {
  try {
    apiIntegrations.value = await getIntegrations(); // Call your API function to fetch roles
    // Find the API integration that contains the current operation
    const apiIntegrationWithOperation = apiIntegrations.value.find(
      (integration) =>
        integration?.apiOperations?.some(
          (operation) => operation.id === data.value?.apiOperation?.id
        )
    );
    // Update apiOperations list for the selected integration
    if (apiIntegrationWithOperation) {
      // Set the selected API integration
      selectedApiIntegration.value = apiIntegrationWithOperation?.id;
      apiOperations.value = apiIntegrationWithOperation.apiOperations;
    } else {
      // Set the selected API integration
      selectedApiIntegration.value = apiIntegrations.value[0]?.id;
      apiOperations.value = apiIntegrations.value[0]?.apiOperations;
    }
  } catch (err) {
    console.error("Error fetching API integrations:", err);
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

const fetchData = async () => {
  isLoading.value = true;
  isError.value = false;
  try {
    [
      allPaymentOperations.value,
      allPaymentIntegrations.value,
      apiIntegrations.value,
      data.value,
    ] = await Promise.all([
      getPaymentOperations().catch(() => []),
      getPaymentIntegrations().catch(() => []),
      getIntegrations().catch(() => []),
      getPaymentOperationById(operationId).catch(() => []),
    ]);
    isError.value = false;

    allPaymentOperations.value = allPaymentOperations.value.filter(
      (operation) =>
        operation?.paymentIntegration?.id === data.value?.paymentIntegration?.id
    );
    // console.log("payOps: ", payOps);
    formId.value = data.value?.form?.id;

    // Find the API integration that contains the current operation
    const apiIntegrationWithOperation = apiIntegrations.value.find(
      (integration) =>
        integration?.apiOperations?.some(
          (operation) => operation.id === data.value?.apiOperation?.id
        )
    );

    // Update apiOperations list for the selected integration
    if (apiIntegrationWithOperation) {
      // Set the selected API integration
      selectedApiIntegration.value = apiIntegrationWithOperation?.id;
      apiOperations.value = apiIntegrationWithOperation.apiOperations;
    } else {
      // Set the selected API integration
      selectedApiIntegration.value = apiIntegrations.value[0]?.id;
      apiOperations.value = apiIntegrations.value[0]?.apiOperations;
    }
  } catch (error) {
    isError.value = true;
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

await useAsyncData("paymentOperationData", async () => {
  await fetchData();
  // getApiIntegrationsData();
  // getPaymentOperationData();
  // getAllPaymentIntegrations();
  // getAllPaymentOperations();
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

watch(selectedApiIntegration, async (newApiIntegrationId) => {
  apiIntegrations.value.filter((integration) => {
    if (integration.id === newApiIntegrationId) {
      apiOperations.value = integration.apiOperations;
    }
  });
});
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <form @submit="onSubmit">
      <UiTabs defaultValue="info" class="w-full">
        <UiTabsList
          class="w-full flex overflow-x-scroll justify-start px-6 py-4 h-fit gap-2 border-b rounded-t-lg rounded-b-none border-primary bg-background"
        >
          <UiTabsTrigger
            class="text-lg font-normal w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="info"
            >Info</UiTabsTrigger
          >
          <UiTabsTrigger
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="form"
            >Form</UiTabsTrigger
          >
          <UiTabsTrigger
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="fields"
            >Fields</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg font-normal w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="mapping"
            >Api request mapping</UiTabsTrigger
          >
        </UiTabsList>
        <UiTabsContent class="p-6" value="info">
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
              :model-value="selectedApiIntegration"
              v-slot="{ componentField }"
              name="apiIntegration"
            >
              <FormItem>
                <FormLabel> API Integration </FormLabel>
                <UiSelect
                  v-bind="componentField"
                  @update:modelValue="
                    (value) => (selectedApiIntegration = value)
                  "
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
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select an API operation" />
                    </UiSelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in apiOperations"
                        :key="item.id"
                        :value="item.id"
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
                  <FormMessage />
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in allPaymentOperations"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.paymentOperationType }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
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
                        placeholder="Select a next payment operation"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <UiSelectContent>
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

                Update
              </UiButton>
            </div>
          </div>
        </UiTabsContent>
        <UiTabsContent class="p-6" value="mapping">
          <PaymentOperationsMapping
            :operationIdProps="operationId"
            :apiRequestMappingsRegistry="data?.apiRequestMappingsRegistry"
          />
        </UiTabsContent>
        <UiTabsContent class="p-6" value="form">
          <PaymentOperationsForms :operationIdProps="operationId" />
        </UiTabsContent>

        <UiTabsContent class="text-base h-full p-6 space-y-4" value="fields">
          <PaymentOperationsFields
            :fields="data?.fields"
            :formIdProps="formId"
          />
        </UiTabsContent>
      </UiTabs>
    </form>
  </div>
</template>
