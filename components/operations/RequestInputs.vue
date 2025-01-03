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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { DataType, LogicalOperators, Operators } from "@/global-types";

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

// Add this interface if not already present
interface ValidationRule {
  operator: string;
  against: string;
  errorMessage: string;
}

// Modify the addNewParameter function to properly initialize validation rules
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

  // Initialize with empty validation rules array
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
    validationMessage: "",
    logicalOperator: "",
    validationRules: [], // Initialize as empty array
  };
};

// Add state for managing validation rules
const currentValidationRules = ref<ValidationRule[]>([]);

// Function to add new validation rule
const addValidationRule = () => {
  if (!newParameter.value.validationRules) {
    newParameter.value.validationRules = [];
  }
  newParameter.value.validationRules.push({
    operator: "",
    against: "",
    errorMessage: "",
  });
};

// Function to remove validation rule
const removeValidationRule = (index: number) => {
  if (newParameter.value.validationRules) {
    newParameter.value.validationRules.splice(index, 1);
  }
};

// Modify the createNewParameter function
const createNewParameter = form.handleSubmit(async (values: any) => {
  console.log("values before modification", values);
  const submissionData = {
    ...values,
    apiOperation: { id: operationId.value },
    validationRules: newParameter.value.validationRules || [], // Include validation rules
  };
  console.log("submissionData", submissionData);

  // try {
  //   loading.value = true;
  //   const createdRequestInput = await createNewRequestInput(submissionData);
  //   requestInputs.value.push(createdRequestInput);
  //   newParameter.value = null;

  //   toast({
  //     title: "Request Input Created",
  //     description: "Request input created successfully",
  //   });

  //   form.resetForm();
  // } catch (err: any) {
  //   console.error("Error creating request input:", err);
  //   isError.value = true;
  // } finally {
  //   loading.value = false;
  // }
});

const deleteRequestInputHandler = async (id: string) => {
  try {
    isDeleting.value = true;
    await deleteRequestInput(id);

    // Update the local state by filtering out the deleted item
    requestInputs.value = requestInputs.value.filter((item) => item.id !== id);

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
  <div class="w-full flex justify-end">
    <UiButton
      :disabled="loading"
      size="sm"
      type="button"
      @click="addNewParameter"
    >
      <Icon name="material-symbols:add-2" class="mr-2 h-4 w-4"></Icon>
      Add Parameter
    </UiButton>
  </div>

  <UiAccordion type="single" collapsible defaultValue="newParameter">
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-if="newParameter"
      value="newParameter"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        New Parameter
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 rounded-lg bg-muted">
        <form @submit="createNewParameter">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2"
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
            <Sheet>
              <SheetTrigger class="w-full">
                <UiButton
                  size="sm"
                  class="w-full"
                  type="button"
                  variant="outline"
                >
                  Add Validation
                </UiButton>
              </SheetTrigger>
              <SheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col"
              >
                <SheetHeader>
                  <SheetTitle class="border-b-2">Validations</SheetTitle>
                  <SheetDescription class="py-4 space-y-4">
                    <!-- Logical Operator -->
                    <FormField
                      :model-value="newParameter.logicalOperator"
                      v-slot="{ componentField }"
                      name="logicalOperator"
                    >
                      <FormItem>
                        <FormLabel>Logical Operator</FormLabel>
                        <UiSelect v-bind="componentField">
                          <FormControl>
                            <UiSelectTrigger>
                              <UiSelectValue
                                placeholder="Select a logical operator"
                              />
                            </UiSelectTrigger>
                          </FormControl>
                          <UiSelectContent>
                            <UiSelectGroup>
                              <UiSelectItem
                                v-for="op in Object.values(LogicalOperators)"
                                :value="op"
                                :key="op"
                              >
                                {{ op }}
                              </UiSelectItem>
                            </UiSelectGroup>
                          </UiSelectContent>
                        </UiSelect>
                      </FormItem>
                    </FormField>

                    <!-- Validation Message -->
                    <FormField
                      :model-value="newParameter?.validationMessage"
                      v-slot="{ componentField }"
                      name="validationMessage"
                    >
                      <FormItem>
                        <FormLabel> Validation Message </FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="validation message"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <!-- Validation Rules section -->
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold">Validation Rules</h2>
                        <UiButton
                          type="button"
                          variant="outline"
                          size="sm"
                          @click="addValidationRule"
                        >
                          <Icon
                            name="material-symbols:add"
                            class="mr-2 h-4 w-4"
                          />
                          Add Rule
                        </UiButton>
                      </div>

                      <div
                        v-for="(rule, index) in newParameter.validationRules"
                        :key="index"
                        class="border p-4 rounded-lg space-y-4"
                      >
                        <div class="flex justify-end">
                          <UiButton
                            type="button"
                            variant="destructive"
                            size="sm"
                            @click="removeValidationRule(index)"
                          >
                            <Icon
                              name="material-symbols:delete-outline"
                              class="h-4 w-4"
                            />
                          </UiButton>
                        </div>

                        <FormField v-model="rule.operator">
                          <FormItem>
                            <FormLabel>Operator</FormLabel>
                            <UiSelect v-model="rule.operator">
                              <FormControl>
                                <UiSelectTrigger>
                                  <UiSelectValue
                                    placeholder="Select an operator"
                                  />
                                </UiSelectTrigger>
                              </FormControl>
                              <UiSelectContent>
                                <UiSelectGroup>
                                  <UiSelectItem
                                    v-for="op in Object.values(Operators)"
                                    :value="op"
                                    :key="op"
                                  >
                                    {{ op }}
                                  </UiSelectItem>
                                </UiSelectGroup>
                              </UiSelectContent>
                            </UiSelect>
                          </FormItem>
                        </FormField>

                        <FormField v-model="rule.against">
                          <FormItem>
                            <FormLabel>Against</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                placeholder="against"
                                v-model="rule.against"
                              />
                            </FormControl>
                          </FormItem>
                        </FormField>

                        <FormField v-model="rule.errorMessage">
                          <FormItem>
                            <FormLabel>Error Message</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                placeholder="error message"
                                v-model="rule.errorMessage"
                              />
                            </FormControl>
                          </FormItem>
                        </FormField>
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter class="flex justify-end gap-4 mt-auto">
                  <SheetClose asChild>
                    <UiButton variant="outline">Cancel</UiButton>
                  </SheetClose>
                  <UiButton @click="onSubmit" type="button">
                    Save changes
                  </UiButton>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          <div
            class="col-span-full w-full pt-4 border-t flex justify-end gap-4"
          >
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
        </form>
      </UiAccordionContent>
    </UiAccordionItem>
    <!-- Existing accordion items for requestInputs -->
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-for="item in requestInputs"
      :value="item.id"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        {{ item.inputName }}
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 bg-muted rounded-lg">
        <form @submit="onSubmit">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4"
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
                      <UiSelectItem
                        v-for="item in Object.values(DataType)"
                        :value="item"
                        :key="item"
                      >
                        {{ item }}
                      </UiSelectItem>
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
              :model-value="item.valueSourcePath"
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

            <Sheet>
              <SheetTrigger class="w-full">
                <UiButton
                  size="sm"
                  class="w-full"
                  type="button"
                  variant="outline"
                >
                  Add Validation
                </UiButton>
              </SheetTrigger>
              <SheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col"
              >
                <SheetHeader>
                  <SheetTitle class="border-b-2">Validations</SheetTitle>
                  <SheetDescription class="py-4 space-y-4">
                    <!-- Logical Operator -->
                    <FormField
                      v-model="item.logicalOperator"
                      name="logicalOperator"
                      v-slot="{ componentField }"
                    >
                      <FormItem>
                        <FormLabel>Logical Operator</FormLabel>
                        <UiSelect v-bind="componentField">
                          <FormControl>
                            <UiSelectTrigger>
                              <UiSelectValue
                                placeholder="Select a logical operator"
                              />
                            </UiSelectTrigger>
                          </FormControl>
                          <UiSelectContent>
                            <UiSelectGroup>
                              <UiSelectItem
                                v-for="op in Object.values(LogicalOperators)"
                                :value="op"
                                :key="op"
                              >
                                {{ op }}
                              </UiSelectItem>
                            </UiSelectGroup>
                          </UiSelectContent>
                        </UiSelect>
                      </FormItem>
                    </FormField>

                    <!-- Validation Message -->
                    <FormField
                      v-model="item.validationMessage"
                      v-slot="{ componentField }"
                      name="validationMessage"
                    >
                      <FormItem>
                        <FormLabel>Validation Message</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="validation message"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <!-- Validation Rules -->
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <h2 class="text-lg font-bold">Validation Rules</h2>
                        <UiButton type="button" variant="outline" size="sm">
                          <Icon
                            name="material-symbols:add"
                            class="mr-2 h-4 w-4"
                          />
                          Add Rule
                        </UiButton>
                      </div>
                      <div
                        v-for="(rule, index) in item.validationRules"
                        :key="index"
                        class="border p-4 rounded-lg space-y-4"
                      >
                        <FormField
                          v-model="item.validationRules[index].operator"
                          name="operator"
                        >
                          <FormItem>
                            <FormLabel>Operator</FormLabel>
                            <UiSelect v-bind="componentField">
                              <FormControl>
                                <UiSelectTrigger>
                                  <UiSelectValue
                                    placeholder="Select an operator"
                                  />
                                </UiSelectTrigger>
                              </FormControl>
                              <UiSelectContent>
                                <UiSelectGroup>
                                  <UiSelectItem
                                    v-for="op in Object.values(Operators)"
                                    :value="op"
                                    :key="op"
                                  >
                                    {{ op }}
                                  </UiSelectItem>
                                </UiSelectGroup>
                              </UiSelectContent>
                            </UiSelect>
                          </FormItem>
                        </FormField>

                        <FormField
                          v-model="item.validationRules[index].against"
                          v-slot="{ componentField }"
                          name="against"
                        >
                          <FormItem>
                            <FormLabel>Against</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                placeholder="against"
                                v-bind="componentField"
                              />
                            </FormControl>
                          </FormItem>
                        </FormField>

                        <FormField
                          v-model="item.validationRules[index].errorMessage"
                          v-slot="{ componentField }"
                          name="errorMessage"
                        >
                          <FormItem>
                            <FormLabel>Error Message</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                placeholder="error message"
                                v-bind="componentField"
                              />
                            </FormControl>
                          </FormItem>
                        </FormField>
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
                <SheetFooter class="flex justify-end gap-4 mt-auto">
                  <SheetClose asChild>
                    <UiButton variant="outline">Cancel</UiButton>
                  </SheetClose>
                  <UiButton @click="onSubmit" type="button">
                    Save changes
                  </UiButton>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          <div
            class="col-span-full w-full flex justify-end gap-4 pt-4 border-t"
          >
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
                    @click="deleteRequestInputHandler(item.id)"
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
      v-if="requestInputs.length === 0 && !newParameter"
    >
      No request inputs
    </div>
  </UiAccordion>
</template>
