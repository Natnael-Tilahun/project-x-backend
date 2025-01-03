<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { apiRequestMappingsRegistryFormSchema } from "~/validations/apiRequestMappingsRegistryFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DataType, TransferParams, MappingPathPrefix } from "@/global-types";

const route = useRoute();
const {
  getPaymentOperationById,
  updatePaymentOperation,
  deletePaymentOperation,
  createNewPaymentOperation,
  isSubmitting,
  isLoading,
} = usePaymentOperations();

const { getOperationById } = useOperations();

const loading = ref(isLoading.value);
const isFetching = ref(false);
const isDeleting = ref(false);
const isError = ref(false);
const operationId = ref<string>("");
const apiOperationId = ref<string>("");
const apiOperationRequestInputName = ref<string[]>([]);
const MappingPathPrefixs = ref(Object.values(MappingPathPrefix)[0]);
const mappingPathPrefix = ref(MappingPathPrefixs[0] || "");
const mappingPathValues = ref<string[]>([]);
const apiOperationData = ref<ApiOperation | null>(null);
const paymentOperationData = ref<PaymentOperation | null>(null);
// Initialize formId and operationId from both route and props
const props = defineProps<{
  apiRequestMappingsRegistry?: ApiRequestMappingsRegistry[];
  operationIdProps?: string;
}>();

// Set operationId and formId with priority to props over route
operationId.value =
  props?.operationIdProps || (route.query.operationId as string) || "";

const apiRequestMappingsRegistry = ref<ApiRequestMappingsRegistry[]>(
  props?.apiRequestMappingsRegistry || []
);

const form = useForm<PaymentOperation>({
  validationSchema: apiRequestMappingsRegistryFormSchema,
});

console.log("operationId: ", operationId.value);

// Modify getFormData to check for formId before making the request
const getOperationData = async () => {
  try {
    if (!operationId.value) {
      console.warn("Operation ID is not available");
      toast({
        title: "Operation ID is required",
        description:
          "Please provide a operation ID. If you don't have a operation ID, please create a new operation first.",
        variant: "destructive",
      });
      return;
    }
    isFetching.value = true;
    paymentOperationData.value = await getPaymentOperationById(
      operationId.value
    );
    mappingPathValues.value = paymentOperationData.value?.form?.fields?.map(
      (field) => field.name
    );
    if (
      paymentOperationData.value?.paymentOperationType ==
      "PROCESS_PAYMENT_AND_NOTIFY_WEBHOOK"
    ) {
      MappingPathPrefixs.value = Object.values(MappingPathPrefix).filter(
        (prefix) => prefix !== MappingPathPrefix.NOTIFY_API_RESPONSE_PREFIX
      );
    } else if (paymentOperationData.value?.paymentOperationType == "ENQUIRY") {
      MappingPathPrefixs.value = Object.values(MappingPathPrefix).filter(
        (prefix) =>
          prefix == MappingPathPrefix.ENQUIRY_FORM_INPUT_PREFIX ||
          prefix == MappingPathPrefix.CURRENT_CUSTOMER_PREFIX
      );
    }
    apiRequestMappingsRegistry.value =
      paymentOperationData.value?.apiRequestMappingsRegistry || [];
    apiOperationId.value = paymentOperationData.value?.apiOperation?.id;
  } catch (err) {
    console.error("Error fetching operation fields:", err);
    toast({
      title: "Error",
      description: "Failed to fetch operation fields",
      variant: "destructive",
    });
  } finally {
    isFetching.value = false;
  }
};

const getApiOperationData = async () => {
  try {
    if (!apiOperationId.value) {
      console.warn("Api Operation ID is not available");
      toast({
        title: "Api Operation ID is required",
        description:
          "Please provide a api operation ID. If you don't have a api operation ID, please create a new api operation first.",
        variant: "destructive",
      });
      return;
    }
    isFetching.value = true;
    apiOperationData.value = await getOperationById(apiOperationId.value);
    apiOperationRequestInputName.value =
      apiOperationData.value?.requestInputs?.map((input) => input.inputName);
    isFetching.value = false;
  } catch (err) {
    console.error("Error fetching api operation request inputs:", err);
    toast({
      title: "Error",
      description: "Failed to fetch api operation request inputs",
      variant: "destructive",
    });
  } finally {
    isFetching.value = false;
  }
};

// Only fetch data if formId is available
if (operationId.value) {
  await useAsyncData("operationData", async () => {
    await getOperationData();
  });
}

if (apiOperationId.value) {
  await useAsyncData("apiOperationData", async () => {
    await getApiOperationData();
  });
}

// Add this ref to store the original input name when editing
const originalInputName = ref<string>("");

// Update existing parameter
const onSubmit = form.handleSubmit(
  async (values: ApiRequestMappingsRegistry) => {
    const index = apiRequestMappingsRegistry.value.findIndex(
      (item) =>
        item.apiRequestInputName === originalInputName.value ||
        item.apiRequestInputName === values.apiRequestInputName
    );

    if (index !== -1) {
      apiRequestMappingsRegistry.value[index].mappingPath =
        mappingPathPrefix.value + values.mappingPath;
      apiRequestMappingsRegistry.value[index].apiRequestInputName =
        values.apiRequestInputName;
    }
    const updatedData = {
      id: operationId.value,
      apiRequestMappingsRegistry: apiRequestMappingsRegistry.value,
    };
    try {
      loading.value = true;
      const response = await updatePaymentOperation(
        operationId.value,
        updatedData
      );
      toast({
        title: "Mapping Updated",
        description: "Mapping updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating mapping:", err);
      isError.value = true;
    } finally {
      loading.value = false;
    }
  }
);

// Submit new parameter
const createNewFieldHandler = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    if (!operationId.value) {
      throw new Error("Operation ID is required");
      toast({
        title: "Operation ID is required",
        description: "Please provide a operation ID",
        variant: "destructive",
      });
      return;
    }
    const data = {
      id: operationId.value,
      apiRequestMappingsRegistry: [
        ...apiRequestMappingsRegistry.value,
        {
          apiRequestInputName: values.apiRequestInputName,
          mappingPath: mappingPathPrefix.value + values.mappingPath,
        },
      ],
    };

    const response = await updatePaymentOperation(operationId.value, data);
    console.log("response: ", response);
    const createdMapping = response.apiRequestMappingsRegistry;
    // Update the local state by adding the new request input
    apiRequestMappingsRegistry.value = createdMapping;
    // Reset the newParameter state
    newField.value = null;
    // openItems.value = "form";
    toast({
      title: "Mapping Created",
      description: "Mapping created successfully",
    });
    // Reset the form
    form.resetForm();
  } catch (err: any) {
    console.error("Error creating operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

const deleteFieldHandler = async (apiRequestInputName: string) => {
  try {
    isDeleting.value = true;
    apiRequestMappingsRegistry.value = apiRequestMappingsRegistry.value.filter(
      (item) => {
        return item.apiRequestInputName != apiRequestInputName;
      }
    );
    const updatedData = {
      id: operationId.value,
      apiRequestMappingsRegistry: apiRequestMappingsRegistry.value,
    };
    const response = await updatePaymentOperation(
      operationId.value,
      updatedData
    );
    console.log("response: ", response);
    toast({
      title: "Mapping Deleted",
      description: "Mapping deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting mapping:", err);
    isError.value = true;
  } finally {
    isDeleting.value = false;
  }
};

const newField = ref<ApiRequestMappingsRegistry | null>(null); // To hold the new field data

// Add this new function to check if a parameter has required fields filled
const isFieldFilled = (field: ApiRequestMappingsRegistry) => {
  return field.apiRequestInputName && field.mappingPath;
};

// Modify the addNewParameter function
const addNewParameter = () => {
  // Check if there's an existing newParameter and if it's not properly filled
  if (newField.value && !isFieldFilled(newField.value)) {
    toast({
      title: "Incomplete Field",
      description:
        "Please fill in the required fields before adding a new field",
      variant: "destructive",
    });
    return;
  }

  // If previous field was filled, create a new one
  newField.value = {
    apiRequestInputName: null,
    mappingPath: null,
  };
};

watch(
  () => props?.apiRequestMappingsRegistry,
  (newFields) => {
    if (newFields) {
      apiRequestMappingsRegistry.value = newFields;
    }
  }
);

watch(
  () => mappingPathPrefix.value,
  (newData) => {
    if (newData) {
      if (newData == MappingPathPrefix.ENQUIRY_API_RESPONSE_PREFIX) {
        mappingPathValues.value = apiOperationData.value?.responseOutputs?.map(
          (output) => output.outputName
        );
      } else if (newData == MappingPathPrefix.ENQUIRY_FORM_INPUT_PREFIX) {
        mappingPathValues.value = paymentOperationData.value?.form?.fields?.map(
          (field) => field.name
        );
      } else if (newData == MappingPathPrefix.PAYMENT_FORM_INPUT_PREFIX) {
        mappingPathValues.value =
          paymentOperationData.value?.prevPaymentOperation?.form?.fields?.map(
            (field) => field.name
          );
      } else {
        mappingPathValues.value = [];
      }
    }
  }
);

// Add this when opening/editing a field (probably in your template where you show the form)
const startEditing = (item: ApiRequestMappingsRegistry) => {
  originalInputName.value = item.apiRequestInputName;
  // ... other editing setup code ...
};
</script>

<template>
  <div class="w-full flex justify-end">
    <UiButton
      :disabled="loading"
      size="sm"
      type="button"
      @click="addNewParameter"
    >
      <Icon name="material-symbols:add-2" class="mr-2 h-4 w-4"></Icon>
      Add Field
    </UiButton>
  </div>

  <div v-if="isFetching" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <UiAccordion v-else type="single" collapsible defaultValue="newField">
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-if="newField"
      value="newField"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        New Field
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 rounded-lg bg-muted">
        <form @submit="createNewFieldHandler">
          <div class="grid md:grid-cols-4 grid-cols-1 gap-6 pb-2">
            <FormField
              :model-value="newField?.apiRequestInputName"
              v-slot="{ componentField }"
              name="apiRequestInputName"
            >
              <FormItem>
                <FormLabel>API Request Input Name </FormLabel>
                <UiSelect
                  v-bind="componentField"
                  @update:modelValue="
                    (value) => (newField.apiRequestInputName = value)
                  "
                >
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select an API Request Input Name"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in apiOperationRequestInputName"
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
            <div class="w-full h-full flex items-center justify-center">
              <Icon
                name="material-symbols:arrows-outward-rounded"
                class="h-10 w-10 text-primary"
              ></Icon>
            </div>
            <FormField
              :model-value="newField?.mappingPath"
              v-slot="{ componentField }"
              name="mappingPath"
            >
              <FormItem class="col-span-2">
                <FormLabel> Mapping Path </FormLabel>
                <FormControl class="w-full flex">
                  <div class="w-full flex">
                    <UiSelect
                      id="mappingPathPrefix"
                      :model-value="mappingPathPrefix"
                      @update:model-value="
                        (value) => (mappingPathPrefix = value)
                      "
                      class="h-10 w-full"
                    >
                      <UiSelectTrigger
                        class="md:w-fit focus:ring-0 focus:ring-offset-0 rounded-r-none"
                      >
                        <UiSelectValue placeholder="Mapping Path Prefix" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="prefix in Object.values(MappingPathPrefixs)"
                            :value="prefix"
                            >{{ prefix.replace(/\.$/, "") }}</UiSelectItem
                          >
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <UiSelect
                      v-bind="componentField"
                      id="mappingPath"
                      class="h-10 w-full"
                    >
                      <UiSelectTrigger
                        class="md:w-fit focus:ring-0 focus:ring-offset-0 rounded-r-none"
                      >
                        <UiSelectValue placeholder="Mapping Path value" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="value in mappingPathValues"
                            :value="value"
                            >{{ value }}</UiSelectItem
                          >
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div
            class="col-span-full w-full pt-4 border-t flex justify-end gap-4"
          >
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
              @click="newField = null"
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
        </form>
      </UiAccordionContent>
    </UiAccordionItem>
    <!-- Existing accordion items for requestInputs -->
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-for="item in apiRequestMappingsRegistry"
      :value="item.apiRequestInputName"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        {{ item.apiRequestInputName }}
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 bg-muted rounded-lg">
        <form @submit="onSubmit">
          <div class="grid md:grid-cols-4 grid-cols-1 gap-6 pb-4">
            <FormField
              :model-value="item?.apiRequestInputName"
              v-slot="{ componentField }"
              name="apiRequestInputName"
              @update:model-value="startEditing(item)"
            >
              <FormItem>
                <FormLabel>API Request Input Name </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select an API Request Input Name"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="inputName in apiOperationRequestInputName"
                        :key="inputName"
                        :value="inputName"
                      >
                        {{ inputName }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="w-full h-full flex items-center justify-center">
              <Icon
                name="material-symbols:arrows-outward-rounded"
                class="h-10 w-10 text-primary"
              ></Icon>
            </div>
            <FormField
              :model-value="item?.mappingPath.split('.')[1]"
              v-slot="{ componentField }"
              name="mappingPath"
            >
              <FormItem class="col-span-2">
                <FormLabel> Mapping Path {{ item.mappingPath }} </FormLabel>
                <FormControl class="w-full flex">
                  <div class="w-full flex">
                    <UiSelect
                      id="mappingPathPrefix"
                      :model-value="mappingPathPrefix"
                      @update:model-value="
                        (value) => (mappingPathPrefix = value)
                      "
                      class="h-10 w-full"
                    >
                      <UiSelectTrigger
                        class="md:w-full focus:ring-0 focus:ring-offset-0 rounded-r-none"
                      >
                        <UiSelectValue placeholder="Mapping Path Prefix" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="prefix in Object.values(MappingPathPrefixs)"
                            :value="prefix"
                            >{{ prefix.replace(/\.$/, "") }}</UiSelectItem
                          >
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                    <UiSelect
                      v-bind="componentField"
                      id="mappingPath"
                      class="h-10 w-full"
                    >
                      <UiSelectTrigger
                        class="md:w-full focus:ring-0 focus:ring-offset-0 rounded-r-none"
                      >
                        <UiSelectValue placeholder="Mapping Path value" />
                      </UiSelectTrigger>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="value in mappingPathValues"
                            :value="value"
                            >{{ value }}</UiSelectItem
                          >
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div
            class="col-span-full w-full flex justify-end gap-4 pt-4 border-t"
          >
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
            >
              Cancel
            </UiButton>

            <UiAlertDialog>
              <UiAlertDialogTrigger asChild>
                <UiButton
                  :disabled="isDeleting"
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  <Icon
                    name="svg-spinners:8-dots-rotate"
                    v-if="isDeleting"
                    class="mr-2 h-4 w-4 animate-spin"
                  ></Icon>

                  Delete
                </UiButton>
              </UiAlertDialogTrigger>
              <UiAlertDialogContent>
                <UiAlertDialogHeader>
                  <UiAlertDialogTitle
                    >Are you absolutely sure?</UiAlertDialogTitle
                  >
                  <UiAlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the request input and remove your data from our servers.
                  </UiAlertDialogDescription>
                </UiAlertDialogHeader>
                <UiAlertDialogFooter>
                  <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
                  <UiAlertDialogAction
                    @click="deleteFieldHandler(item.apiRequestInputName)"
                    >Continue</UiAlertDialogAction
                  >
                </UiAlertDialogFooter>
              </UiAlertDialogContent>
            </UiAlertDialog>

            <UiButton :disabled="loading" size="sm" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="loading"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Update
            </UiButton>
          </div>
        </form>
      </UiAccordionContent>
    </UiAccordionItem>

    <div
      class="w-full flex justify-center items-center h-20"
      v-if="fields?.length == 0 && !newField"
    >
      No fields
    </div>
  </UiAccordion>
</template>
