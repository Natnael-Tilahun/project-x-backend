<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { apiOperationRequestInputFormSchema } from "~/validations/apiOperationRequestInputFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DataType, LogicalOperators, Operators } from "@/global-types";
import type { RequestInput } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const route = useRoute();
const {
  getRequestInputById,
  updateRequestInput,
  deleteRequestInput,
  createNewRequestInput,
  isSubmitting,
  isLoading,
} = useOperationRequestInputs();

const loading = ref(isLoading.value);
const isDeleting = ref(false);
const isError = ref(false);
const operationId = ref<string>("");

operationId.value = route.query.operationId as string;

const props = defineProps<{
  requestInputs?: RequestInput[];
  operationIdProps?: string;
}>();

if (props.operationIdProps) {
  operationId.value = props.operationIdProps;
}

const requestInputs = ref<RequestInput[]>(props.requestInputs || []);
const form = useForm<RequestInput>({
  validationSchema: apiOperationRequestInputFormSchema,
});

// Add emit definition
const emit = defineEmits(["update:operation"]);

// Update existing parameter
const onSubmit = form.handleSubmit(async (values: RequestInput) => {
  try {
    loading.value = true;
    const updatedRequestInput = await updateRequestInput(values.id, values);

    const index = requestInputs.value.findIndex(
      (item) => item.id === values.id
    );
    if (index !== -1) {
      requestInputs.value[index] = updatedRequestInput;
    }

    // Emit event to trigger parent refresh
    emit("update:operation");

    toast({
      title: "Request Input Updated",
      description: "Request input updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating request input:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

// Add handler for validation rules update
const handleValidationRulesUpdate = (updatedInput: RequestInput) => {
  const index = requestInputs.value.findIndex(
    (item) => item.id === updatedInput.id
  );
  if (index !== -1) {
    requestInputs.value[index] = updatedInput;
    emit("update:operation");
  }
};

// Submit new parameter
const createNewParameter = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const data = {
      ...values,
      apiOperationId :operationId.value
    };
    const createdRequestInput = await createNewRequestInput(data);

    // Update the local state by adding the new request input
    requestInputs.value.push(createdRequestInput);

    // Reset the newParameter state
    newParameter.value = null;

    toast({
      title: "Request Input Created",
      description: "Request input created successfully",
    });

    // Reset the form
    form.resetForm();
  } catch (err: any) {
    console.error("Error creating request input:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

const deleteRequestInputHandler = async (id: string) => {
  try {
    isDeleting.value = true;
    await deleteRequestInput(id);

    // Update the local state by filtering out the deleted item
    requestInputs.value = requestInputs.value.filter((item) => item.id !== id);
    emit("update:operation");

    toast({
      title: "Request Input Deleted",
      description: "Request input deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting request input:", err);
    isError.value = true;
  } finally {
    isDeleting.value = false;
  }
};

const newParameter = ref<RequestInput | null>(null); // To hold the new parameter data

// Add this new function to check if a parameter has required fields filled
const isParameterFilled = (parameter: RequestInput) => {
  return parameter.inputName && parameter.inputType && parameter.dataType;
};

// Modify the addNewParameter function
const addNewParameter = () => {
  // Check if there's an existing newParameter and if it's not properly filled
  if (newParameter.value && !isParameterFilled(newParameter.value)) {
    toast({
      title: "Incomplete Parameter",
      description:
        "Please fill in the required fields before adding a new parameter",
      variant: "destructive",
    });
    return;
  }

  // If previous parameter was filled, create a new one
  newParameter.value = {
    inputName: "",
    inputType: "",
    dataType: "",
    testValue: "",
    defaultValue: "",
    valueSourcePath: "",
    maxLength: null,
    minLength: null,
    minValue: null,
    maxValue: null,
    validationPattern: "",
    transformationRule: "",
    isRequired: false,
    isHidden: false,
    isEncoded: false,
  };
};

watch(
  () => props.requestInputs,
  (newInputs) => {
    if (newInputs) {
      requestInputs.value = newInputs;
    }
  }
);
</script>

<template>
  <UiAccordion
    type="single"
    class="w-full"
    collapsible
    defaultValue="newParameter"
  >
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2 text-sm"
      v-if="newParameter"
      value="newParameter"
    >
      <UiAccordionTrigger
        class="text-sm font-semibold border px-4 py-4 rounded-lg"
      >
        New Parameter
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-4 px-4 rounded-lg bg-muted">
        <form @submit="createNewParameter">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2 text-sm"
          >
            <FormField
              :model-value="newParameter?.inputName"
              v-slot="{ componentField }"
              name="inputName"
            >
              <FormItem>
                <FormLabel> Input Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="input name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.inputType"
              v-slot="{ componentField }"
              name="inputType"
            >
              <FormItem>
                <FormLabel> Input Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a input type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="HEADER"> HEADER </UiSelectItem>
                      <UiSelectItem value="BODY"> BODY </UiSelectItem>
                      <UiSelectItem value="QUERY"> QUERY </UiSelectItem>
                      <UiSelectItem value="PATH"> PATH </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.dataType"
              v-slot="{ componentField }"
              name="dataType"
            >
              <FormItem>
                <FormLabel> Data Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a data type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(DataType)"
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
              :model-value="newParameter?.testValue"
              v-slot="{ componentField }"
              name="testValue"
            >
              <FormItem>
                <FormLabel> Test Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="test value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.defaultValue"
              v-slot="{ componentField }"
              name="defaultValue"
            >
              <FormItem>
                <FormLabel> Default Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="default value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.valueSourcePath"
              v-slot="{ componentField }"
              name="valueSourcePath"
            >
              <FormItem>
                <FormLabel> Value Source Path </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="value source path"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.maxLength"
              v-slot="{ componentField }"
              name="maxLength"
            >
              <FormItem>
                <FormLabel> Max Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="max length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.minLength"
              v-slot="{ componentField }"
              name="minLength"
            >
              <FormItem>
                <FormLabel> Min Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="min length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.minValue"
              v-slot="{ componentField }"
              name="minValue"
            >
              <FormItem>
                <FormLabel> Min Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="min value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.maxValue"
              v-slot="{ componentField }"
              name="maxValue"
            >
              <FormItem>
                <FormLabel> Max Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="max value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.validationPattern"
              v-slot="{ componentField }"
              name="validationPattern"
            >
              <FormItem>
                <FormLabel> Validation Pattern </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="validation pattern"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.transformationRule"
              v-slot="{ componentField }"
              name="transformationRule"
            >
              <FormItem>
                <FormLabel> Transformation Rule </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="transformation rule"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isRequired"
              v-slot="{ componentField }"
              name="isRequired"
            >
              <FormItem>
                <FormLabel> Is Required </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isRequired"
                    @update:checked="
                      newParameter.isRequired = !newParameter.isRequired
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isHidden"
              v-slot="{ componentField }"
              name="isHidden"
            >
              <FormItem>
                <FormLabel> Is Hidden </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isHidden"
                    @update:checked="
                      newParameter.isHidden = !newParameter.isHidden
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isEncoded"
              v-slot="{ componentField }"
              name="isEncoded"
            >
              <FormItem>
                <FormLabel> Is Encoded </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isEncoded"
                    @update:checked="
                      newParameter.isEncoded = !newParameter.isEncoded
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
   <UiPermissionGuard :permission=PermissionConstants.CREATE_REQUEST_INPUT >

          <div
            class="col-span-full w-full pt-4 border-t flex justify-end gap-4"
          >
            <!-- <UiSheet>
              <UiSheetTrigger>
                <UiButton variant="outline" type="button" size="sm">
                  Manage Validation Rules
                </UiButton>
              </UiSheetTrigger>
              <UiSheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
              >
                <OperationsValidationRules :requestInput="item" />
              </UiSheetContent>
            </UiSheet> -->
            
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
              @click="newParameter = null"
            >
              Delete
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
          </UiPermissionGuard>
        </form>
      </UiAccordionContent>
    </UiAccordionItem>

    <!-- Tabs for categorizing parameters -->
    <UiTabs defaultValue="header" class="w-full">
      <UiTabsList class="w-full flex justify-start py-0 gap-2 border-b">
        <UiTabsTrigger
          v-for="type in ['HEADER', 'BODY', 'QUERY', 'PATH', 'NONE']"
          :key="type"
          :value="type.toLowerCase()"
          class="text-sm font-medium"
        >
          {{ type }}
          <span class="ml-2 text-xs text-muted-foreground">
            ({{
              requestInputs.filter((input) => input.inputType === type).length
            }})
          </span>
        </UiTabsTrigger>
   <UiPermissionGuard :permission=PermissionConstants.CREATE_REQUEST_INPUT >
        <div class="w-full flex justify-end">
          <UiButton
            :disabled="loading"
            size="sm"
            type="button"
            variant="outline"
            class="border-primary text-primary"
            @click="addNewParameter"
          >
            <Icon name="material-symbols:add-2" class="mr-2 h-4 w-4"></Icon>
            Add Parameter
          </UiButton>
        </div>
        </UiPermissionGuard>
      </UiTabsList>

      <!-- Tab content for each input type -->
      <UiTabsContent
        v-for="type in ['HEADER', 'BODY', 'QUERY', 'PATH', 'NONE']"
        :key="type"
        :value="type.toLowerCase()"
        class="px-0"
      >
        <UiAccordion type="single" collapsible>
          <UiAccordionItem
            v-for="item in requestInputs.filter(
              (input) => input.inputType === type
            )"
            :key="item.id"
            :value="item.id"
            class="my-2 border rounded-lg"
          >
            <UiAccordionTrigger class="px-4 py-3">
              <div class="flex items-center justify-between w-full">
                <span class="font-medium text-sm">{{ item.inputName }}</span>
                <span class="text-xs text-muted-foreground">
                  {{ item.dataType }}
                </span>
              </div>
            </UiAccordionTrigger>
            <UiAccordionContent class="p-4 bg-muted/50">
              <form @submit="onSubmit">
                <div
                  class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2 text-sm"
                >
                  <FormField
                    :model-value="item.id"
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
                    :model-value="item.inputName"
                    v-slot="{ componentField }"
                    name="inputName"
                  >
                    <FormItem>
                      <FormLabel> Input Name </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="input name"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.inputType"
                    v-slot="{ componentField }"
                    name="inputType"
                  >
                    <FormItem>
                      <FormLabel> Input Type </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select a input type" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem value="HEADER"> HEADER </UiSelectItem>
                            <UiSelectItem value="BODY"> BODY </UiSelectItem>
                            <UiSelectItem value="QUERY"> QUERY </UiSelectItem>
                            <UiSelectItem value="PATH"> PATH </UiSelectItem>
                            <UiSelectItem value="NONE"> NONE </UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.dataType"
                    v-slot="{ componentField }"
                    name="dataType"
                  >
                    <FormItem>
                      <FormLabel> Data Type </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select a data type" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem value="STRING"> STRING </UiSelectItem>
                            <UiSelectItem value="INT"> INT </UiSelectItem>
                            <UiSelectItem value="LONG"> LONG </UiSelectItem>
                            <UiSelectItem value="DOUBLE"> DOUBLE </UiSelectItem>
                            <UiSelectItem value="BOOLEAN">
                              BOOLEAN
                            </UiSelectItem>
                            <UiSelectItem value="DATETIME">
                              DATETIME
                            </UiSelectItem>
                            <UiSelectItem value="COLLECTION">
                              COLLECTION
                            </UiSelectItem>
                            <UiSelectItem value="NONE"> NONE </UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.testValue"
                    v-slot="{ componentField }"
                    name="testValue"
                  >
                    <FormItem>
                      <FormLabel> Test Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="test value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.defaultValue"
                    v-slot="{ componentField }"
                    name="defaultValue"
                  >
                    <FormItem>
                      <FormLabel> Default Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="default value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.maxLength"
                    v-slot="{ componentField }"
                    name="maxLength"
                  >
                    <FormItem>
                      <FormLabel> Max Length </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="max length"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.minLength"
                    v-slot="{ componentField }"
                    name="minLength"
                  >
                    <FormItem>
                      <FormLabel> Min Length </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="min length"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.minValue"
                    v-slot="{ componentField }"
                    name="minValue"
                  >
                    <FormItem>
                      <FormLabel> Min Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="min value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.maxValue"
                    v-slot="{ componentField }"
                    name="maxValue"
                  >
                    <FormItem>
                      <FormLabel> Max Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="max value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.validationPattern"
                    v-slot="{ componentField }"
                    name="validationPattern"
                  >
                    <FormItem>
                      <FormLabel> Validation Pattern </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="validation pattern"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.transformationRule"
                    v-slot="{ componentField }"
                    name="transformationRule"
                  >
                    <FormItem>
                      <FormLabel> Transformation Rule </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="transformation rule"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.isRequired"
                    v-slot="{ componentField }"
                    name="isRequired"
                  >
                    <FormItem>
                      <FormLabel> Is Required </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="item.isRequired"
                          @update:checked="item.isRequired = !item.isRequired"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.isHidden"
                    v-slot="{ componentField }"
                    name="isHidden"
                  >
                    <FormItem>
                      <FormLabel> Is Hidden </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="item.isHidden"
                          @update:checked="item.isHidden = !item.isHidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="item.isEncoded"
                    v-slot="{ componentField }"
                    name="isEncoded"
                  >
                    <FormItem>
                      <FormLabel> Is Encoded </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="item.isEncoded"
                          @update:checked="item.isEncoded = !item.isEncoded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div
                  class="col-span-full w-full flex justify-end gap-4 pt-4 border-t"
                >
                  <UiSheet>
                    <UiSheetTrigger>
                      <UiButton variant="outline" type="button" size="sm">
                        Manage Validation Rules
                      </UiButton>
                    </UiSheetTrigger>
                    <UiSheetContent
                      class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
                    >
                      <OperationsRequestInputsValidationRules
                        :requestInput="item"
                        @update:requestInput="handleValidationRulesUpdate"
                      />
                    </UiSheetContent>
                  </UiSheet>
                  <UiButton
                    :disabled="loading"
                    variant="outline"
                    type="button"
                    size="sm"
                    @click="$router.go(-1)"
                  >
                    Cancel
                  </UiButton>

                  <UiAlertDialog>
   <UiPermissionGuard :permission=PermissionConstants.DELETE_REQUEST_INPUT >
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
                    </UiPermissionGuard>
                    <UiAlertDialogContent>
                      <UiAlertDialogHeader>
                        <UiAlertDialogTitle
                          >Are you absolutely sure?</UiAlertDialogTitle
                        >
                        <UiAlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the request input and remove your data from our
                          servers.
                        </UiAlertDialogDescription>
                      </UiAlertDialogHeader>
                      <UiAlertDialogFooter>
                        <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
                        <UiAlertDialogAction
                          @click="deleteRequestInputHandler(item.id)"
                          >Continue</UiAlertDialogAction
                        >
                      </UiAlertDialogFooter>
                    </UiAlertDialogContent>
                  </UiAlertDialog>

   <UiPermissionGuard :permission=PermissionConstants.UPDATE_REQUEST_INPUT >
                  <UiButton :disabled="loading" size="sm" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="loading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>

                    Update
                  </UiButton>
                  </UiPermissionGuard>
                </div>
              </form>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>

        <!-- Empty state for each tab -->
        <div
          v-if="
            !requestInputs.filter((input) => input.inputType === type).length
          "
          class="flex flex-col items-center justify-center py-8 text-muted-foreground"
        >
          <p>No {{ type.toLowerCase() }} parameters</p>
          <UiButton
            variant="outline"
            size="sm"
            class="mt-2"
            type="button"
            :disabled="loading"
            @click="addNewParameter"
          >
            Add New {{ type.toLowerCase() }} parameter
          </UiButton>
        </div>
      </UiTabsContent>
    </UiTabs>
  </UiAccordion>
</template>
