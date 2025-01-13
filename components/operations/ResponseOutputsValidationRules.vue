<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref, nextTick } from "vue";
import { toast } from "~/components/ui/toast";
import { apiOperationResponseOutputValidationRulesFormSchema } from "~/validations/apiOperationResponseOutputValidationRulesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogicalOperators, Operators } from "@/global-types";

interface ResponseOutputValidations {
  logicalOperator: LogicalOperators;
  validationMessage?: string;
  validationRules?: ValidationRule[];
}

const route = useRoute();
const { updateResponseOutput, isLoading } = useOperationResponseOutputs();

const loading = ref(isLoading.value);
const operationId = ref<string>(route.query.operationId as string);
const responseOutputId = ref<string>("");

const props = defineProps<{
  responseOutput?: ResponseOutput;
  operationIdProps?: string;
}>();

if (props.operationIdProps) {
  operationId.value = props.operationIdProps;
}

console.log("props.responseOutputt:", props.responseOutput);

responseOutputId.value = props.responseOutput?.id || "";

// Move helper functions to the top
const getOperatorAgainstFieldCount = (operator: Operators): number => {
  switch (operator) {
    case Operators.BETWEEN:
    case Operators.NBETWEEN:
      return 2;
    case Operators.IN:
    case Operators.NIN:
      return -1;
    case Operators.EMPTY:
    case Operators.NEMPTY:
    case Operators.NNULL:
      return 0;
    default:
      return 1;
  }
};

const formatAgainstValue = (
  against: string | string[],
  operator: Operators
): string[] => {
  // If operator is not set, return empty array with one element
  if (!operator) return [""];

  // If against is already an array, validate it based on operator
  if (Array.isArray(against)) {
    const fieldCount = getOperatorAgainstFieldCount(operator);
    if (fieldCount === 1) return [against[0] || ""];
    if (fieldCount === 2) return against.slice(0, 2);
    if (fieldCount === -1) return against;
    return [];
  }

  // Handle string value
  if (typeof against === "string") {
    const fieldCount = getOperatorAgainstFieldCount(operator);
    if (fieldCount === 1) return [against];
    if (fieldCount === 2) return [against, ""];
    if (fieldCount === -1) return [against];
    return [];
  }

  return [""];
};

const formatAgainstForSubmission = (
  against: string[],
  operator: Operators
): string | string[] => {
  if (!operator || !against) return "";

  const fieldCount = getOperatorAgainstFieldCount(operator);

  // For single value operators
  if (fieldCount === 1) {
    return against[0] || "";
  }

  // For operators that need exactly 2 values
  if (fieldCount === 2) {
    return against.slice(0, 2);
  }

  // For operators that accept multiple values
  if (fieldCount === -1) {
    return against.filter(Boolean);
  }

  // For operators that don't need values
  return [];
};

const initializeFormValues = (responseOutput: ResponseOutput) => {
  if (!responseOutput?.validationConfig) {
    return {
      logicalOperator: null,
      validationRules: [
        {
          operator: null,
          against: [""],
          errorMessage: "",
        },
      ],
    };
  }

  return {
    logicalOperator: responseOutput.validationConfig.logicalOperator,
    validationRules: responseOutput.validationConfig.validationRules.map(
      (rule) => ({
        operator: rule.operator,
        against: Array.isArray(rule.against) ? rule.against : [rule.against],
        errorMessage: rule.errorMessage,
      })
    ),
  };
};

// Then initialize the form
const form = useForm<Partial<ResponseOutput>>({
  validationSchema: apiOperationResponseOutputValidationRulesFormSchema,
  validateOnMount: false,
  initialValues: {
    logicalOperator: null,
    validationRules: [
      {
        operator: null,
        against: [""],
        errorMessage: "",
      },
    ],
  },
});

// Update the watch handler
watch(
  () => props.responseOutput,
  (newValue) => {
    if (newValue) {
      console.log("Initializing form with:", newValue);
      const initialValues = initializeFormValues(newValue);
      console.log("Formatted initial values:", initialValues);

      nextTick(() => {
        form.resetForm({
          values: initialValues,
          touched: {},
          errors: {},
        });
      });
    }
  },
  { immediate: true, deep: true }
);

// Update the onSubmit function
const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true;
    const updateData = {
      ...props.responseOutput,
      id: responseOutputId.value,
      validationConfig: {
        validationRules:
          values?.validationRules?.map((rule) => ({
            operator: rule.operator,
            against: formatAgainstForSubmission(
              rule.against || [],
              rule.operator
            ),
            errorMessage: rule.errorMessage,
          })) || [],
        logicalOperator: values?.logicalOperator,
      },
    };

    console.log("Submitting values:", updateData);
    const updatedResponseOutput = await updateResponseOutput(
      responseOutputId.value,
      updateData
    );
    console.log("updatedResponseOutput:", updatedResponseOutput);

    toast({
      title: "Validation Rules Updated",
      description: "Validation rules updated successfully",
    });
  } catch (err) {
    console.error("Error updating validation rules:", err);
    toast({
      title: "Error",
      description: "Failed to update validation rules",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
});

// Add helper function to check if a rule is filled
const isValidationRuleFilled = (rule: ValidationRule) => {
  return rule.operator && rule.against;
};

// Update the addValidationRule function
const addValidationRule = () => {
  const currentRules = form.values.validationRules || [];
  form.setFieldValue("validationRules", [
    ...currentRules,
    {
      operator: null,
      against: [""],
      errorMessage: "",
    },
  ]);
};

// Update the removeValidationRule function
const removeValidationRule = (index: number) => {
  const currentRules = [...(form.values.validationRules || [])];
  if (currentRules.length > 1) {
    currentRules.splice(index, 1);
    form.setFieldValue("validationRules", currentRules);
  }
};

const addAgainstValue = (ruleIndex: number) => {
  const currentRules = form.values?.validationRules || [];
  if (currentRules[ruleIndex]) {
    const currentAgainst = Array.isArray(currentRules[ruleIndex].against)
      ? currentRules[ruleIndex].against
      : [];

    const operator = currentRules[ruleIndex].operator;
    const fieldCount = getOperatorAgainstFieldCount(operator);

    // Only add if we haven't reached the maximum for BETWEEN operators
    if (fieldCount === 2 && currentAgainst.length >= 2) {
      return;
    }

    form.setFieldValue(`validationRules.${ruleIndex}.against`, [
      ...currentAgainst,
      "",
    ]);
  }
};

const removeAgainstValue = (ruleIndex: number, againstIndex: number) => {
  const currentRules = form.values?.validationRules || [];
  if (
    currentRules[ruleIndex] &&
    Array.isArray(currentRules[ruleIndex].against)
  ) {
    const newAgainst = [...currentRules[ruleIndex].against];
    newAgainst.splice(againstIndex, 1);
    form.setFieldValue(`validationRules.${ruleIndex}.against`, newAgainst);
  }
};

// Update the validation rules watcher
watch(
  () => form.values.validationRules,
  (newRules, oldRules) => {
    if (!newRules || !oldRules) return;

    newRules.forEach((rule, index) => {
      if (!oldRules[index]) return;

      const oldRule = oldRules[index];
      if (rule.operator !== oldRule.operator) {
        const fieldCount = getOperatorAgainstFieldCount(rule.operator);

        nextTick(() => {
          const newAgainst = formatAgainstValue(oldRule.against, rule.operator);
          form.setFieldValue(`validationRules.${index}.against`, newAgainst);
        });
      }
    });
  },
  { deep: true }
);

const getOperatorLabel = (operator: Operators, index: number): string => {
  switch (operator) {
    case Operators.PATTERN:
      return "Regex Pattern";
    case Operators.MAX_LENGTH:
    case Operators.MIN_LENGTH:
      return "Length Value";
    case Operators.IN:
    case Operators.NIN:
      return `Value ${index + 1}`;
    default:
      return "Value";
  }
};

const getPlaceholder = (operator: Operators, index: number): string => {
  switch (operator) {
    case Operators.PATTERN:
      return "Enter regex pattern";
    case Operators.MAX_LENGTH:
    case Operators.MIN_LENGTH:
      return "Enter number";
    case Operators.BETWEEN:
    case Operators.NBETWEEN:
      return index === 0 ? "Enter minimum value" : "Enter maximum value";
    default:
      return "Enter value";
  }
};
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2"
        >Response Outputs Validations</UiSheetTitle
      >
      <UiSheetDescription class="py-4 space-y-4">
        <form @submit="onSubmit" class="space-y-4 text-black">
          <!-- Logical Operator -->
          <FormField
            v-model="form.values.logicalOperator"
            name="logicalOperator"
            v-slot="{ field }"
          >
            <FormItem>
              <FormLabel>Logical Operator</FormLabel>
              <UiSelect v-bind="field">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue
                      :placeholder="field.value || 'Select a logical operator'"
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
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Validation Rules section -->
          <div v-if="form.values.validationRules?.length" class="space-y-4">
            <div
              v-for="(rule, index) in form.values.validationRules"
              :key="index"
              class="border p-4 rounded-lg space-y-4"
            >
              <!-- Operator field -->
              <FormField
                :name="`validationRules.${index}.operator`"
                v-slot="{ field, errors }"
              >
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <UiSelect
                    :model-value="field.value"
                    @update:modelValue="
                      (val) =>
                        form.setFieldValue(
                          `validationRules.${index}.operator`,
                          val
                        )
                    "
                  >
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue
                          :placeholder="field.value || 'Select an operator'"
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
                  <FormMessage>{{ errors[0] }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Against Values -->
              <div class="space-y-2">
                <div class="mb-2">
                  Against Values
                  <span class="text-red-500 ml-1">*</span>
                </div>
                <template
                  v-if="getOperatorAgainstFieldCount(rule.operator) > 0"
                >
                  <div
                    v-for="(_, againstIndex) in rule.against"
                    :key="againstIndex"
                    class="flex gap-2"
                  >
                    <FormField
                      :name="`validationRules.${index}.against.${againstIndex}`"
                      v-slot="{ field, errors }"
                    >
                      <FormItem class="flex-1">
                        <FormLabel>
                          {{
                            getOperatorAgainstFieldCount(rule.operator) === 2
                              ? againstIndex === 0
                                ? "Minimum value"
                                : "Maximum value"
                              : getOperatorLabel(rule.operator, againstIndex)
                          }}
                        </FormLabel>
                        <FormControl>
                          <UiInput
                            :value="field.value"
                            @input="
                              (e) =>
                                form.setFieldValue(
                                  `validationRules.${index}.against.${againstIndex}`,
                                  e.target.value
                                )
                            "
                            type="text"
                            :placeholder="
                              getPlaceholder(rule.operator, againstIndex)
                            "
                          />
                        </FormControl>
                        <FormMessage>{{ errors[0] }}</FormMessage>
                      </FormItem>
                    </FormField>
                  </div>
                </template>
              </div>

              <!-- Error Message -->
              <FormField
                :name="`validationRules.${index}.errorMessage`"
                v-slot="{ field, errors }"
              >
                <FormItem>
                  <FormLabel>Error Message</FormLabel>
                  <FormControl>
                    <UiInput
                      :value="field.value"
                      @input="
                        (e) =>
                          form.setFieldValue(
                            `validationRules.${index}.errorMessage`,
                            e.target.value
                          )
                      "
                      type="text"
                      placeholder="Enter error message"
                    />
                  </FormControl>
                  <FormMessage>{{ errors[0] }}</FormMessage>
                </FormItem>
              </FormField>
            </div>
          </div>
        </form>
      </UiSheetDescription>
    </UiSheetHeader>
    <UiSheetFooter class="flex justify-end gap-4 mt-auto">
      <UiSheetClose asChild>
        <UiButton :disabled="loading" variant="outline">Cancel</UiButton>
      </UiSheetClose>
      <UiButton @click="onSubmit" :disabled="loading" type="button">
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="loading"
          class="mr-2 h-4 w-4 animate-spin"
        ></Icon>
        Save changes
      </UiButton>
    </UiSheetFooter>
  </UiSheet>
</template>
