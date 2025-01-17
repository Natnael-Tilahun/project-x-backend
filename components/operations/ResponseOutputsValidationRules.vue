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
  validationRules?: ValidationRule[];
}

const route = useRoute();
const { updateResponseOutput, isLoading } = useOperationResponseOutputs();

const loading = ref(false);
const isError = ref(false);
const operationId = ref<string>("");
const responseOutputId = ref<string>("");
operationId.value = route.query.operationId as string;

const props = defineProps<{
  responseOutput?: ResponseOutput;
  operationIdProps?: string;
}>();

if (props.operationIdProps) {
  operationId.value = props.operationIdProps;
}

responseOutputId.value = props.responseOutput?.id || "";

// Initialize the form with the existing values or default empty values
const form = useForm<Partial<ResponseOutput>>({
  validationSchema: apiOperationResponseOutputValidationRulesFormSchema,
  initialValues: {
    logicalOperator:
      props.responseOutput?.validationConfig?.logicalOperator || null,
    validationRules: props.responseOutput?.validationConfig?.validationRules
      ?.length
      ? props.responseOutput.validationConfig.validationRules.map((rule) => ({
          operator: rule.operator,
          against: Array.isArray(rule.against)
            ? rule.against
            : rule.against
            ? [rule.against]
            : [""],
          errorMessage: rule.errorMessage,
        }))
      : [
          {
            operator: null,
            against: [""],
            errorMessage: "",
          },
        ],
  },
});

// Update the watcher for props changes
watch(
  () => props.responseOutput?.validationConfig,
  (newConfig) => {
    if (newConfig) {
      form.setValues({
        validationConfig: {
          logicalOperator: newConfig.logicalOperator || null,
          validationRules: newConfig.validationRules?.length
            ? newConfig.validationRules.map((rule) => ({
                operator: rule.operator,
                against: Array.isArray(rule.against)
                  ? rule.against
                  : rule.against
                  ? [rule.against]
                  : [""],
                errorMessage: rule.errorMessage,
              }))
            : [
                {
                  operator: null,
                  against: [""],
                  errorMessage: "",
                },
              ],
        },
      });
    }
  },
  { deep: true, immediate: true }
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
          values?.validationRules?.map((rule) => {
            const fieldCount = getOperatorAgainstFieldCount(rule.operator);
            return {
              operator: rule.operator,
              against:
                fieldCount === 1 ? rule.against?.[0] || "" : rule.against || [],
              errorMessage: rule.errorMessage,
            };
          }) || [],
        logicalOperator: values?.logicalOperator,
      },
    };

    console.log("Submitting values:", updateData);
    const updatedResponseOutput = await updateResponseOutput(
      responseOutputId.value,
      updateData
    );

    // Emit an event to notify parent components
    emit("update:responseOutput", updatedResponseOutput);

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

// Add emits definition
const emit = defineEmits(["update:responseOutput"]);

// Add helper function to check if a rule is filled
const isValidationRuleFilled = (rule: ValidationRule) => {
  return rule.operator && rule.against;
};

// Update the addValidationRule function
const addValidationRule = () => {
  const currentRules = form.values.validationRules || [];
  // Check if the last rule is filled
  const lastRule = currentRules[currentRules.length - 1];
  if (!lastRule || !isValidationRuleFilled(lastRule)) {
    toast({
      title: "Validation Required",
      description:
        "Please fill in the current validation rule before adding a new one",
      variant: "destructive",
    });
    return;
  }

  form.setFieldValue("validationRules", [
    ...currentRules,
    {
      operator: null,
      against: [""],
      errorMessage: null,
    },
  ]);
};

const removeValidationRule = (index: number) => {
  const currentRules = [...(form.values.validationRules || [])];
  currentRules.splice(index, 1);
  form.setFieldValue("validationRules", currentRules);
};

// Add these helper functions to your script section
const getOperatorAgainstFieldCount = (operator: Operators): number => {
  switch (operator) {
    // Operators that need 2 values
    case Operators.BETWEEN:
    case Operators.NBETWEEN:
      return 2;

    // Operators that can have multiple values
    case Operators.IN:
    case Operators.NIN:
      return -1; // unlimited fields

    // Operators that don't need any values
    case Operators.EMPTY:
    case Operators.NEMPTY:
    case Operators.NNULL:
      return 0;

    // Pattern-based operators (single value)
    case Operators.PATTERN:
    case Operators.CONTAINS:
    case Operators.NCONTAINS:
    case Operators.ICONTAINS:
    case Operators.STARTS_WITH:
    case Operators.NSTARTS_WITH:
    case Operators.ISTARTS_WITH:
    case Operators.NISTARTS_WITH:
    case Operators.ENDS_WITH:
    case Operators.NENDS_WITH:
    case Operators.IENDS_WITH:
    case Operators.NIENDS_WITH:
      return 1;

    // Length-based operators (single numeric value)
    case Operators.MAX_LENGTH:
    case Operators.MIN_LENGTH:
      return 1;

    // Comparison operators (single value)
    case Operators.EQ:
    case Operators.NEQ:
    case Operators.LT:
    case Operators.LTE:
    case Operators.GT:
    case Operators.GTE:
      return 1;

    default:
      return 1;
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

// Update the operator change watcher
watch(
  () => form.values.validationConfig?.validationRules,
  (newRules, oldRules) => {
    if (!newRules || !oldRules) return;
    newRules.forEach((rule, index) => {
      const oldRule = oldRules[index];
      if (oldRule && rule.operator !== oldRule.operator) {
        const fieldCount = getOperatorAgainstFieldCount(rule.operator);
        nextTick(() => {
          // Preserve existing values if possible
          const existingValues = oldRule.against || [];
          if (fieldCount === 1) {
            // For single value operators, keep only the first value
            form.setFieldValue(`validationRules.${index}.against`, [
              existingValues[0] || null,
            ]);
          } else if (fieldCount === 2) {
            form.setFieldValue(`validationRules.${index}.against`, [
              existingValues[0] || null,
              existingValues[1] || null,
            ]);
          } else if (fieldCount === -1) {
            form.setFieldValue(
              `validationRules.${index}.against`,
              existingValues.length ? existingValues : [null]
            );
          } else if (fieldCount === 0) {
            form.setFieldValue(`validationRules.${index}.against`, []);
          }
        });
      }
    });
  },
  { deep: true }
);

// Add helper functions for labels and placeholders
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
        <form @submit="onSubmit" class="space-y-4">
          <!-- Logical Operator -->
          <FormField
            :model-value="form.values.logicalOperator"
            name="logicalOperator"
            v-slot="{ componentField }"
          >
            <FormItem>
              <FormLabel>Logical Operator</FormLabel>
              <UiSelect v-bind="componentField">
                <FormControl>
                  <UiSelectTrigger>
                    <UiSelectValue placeholder="Select a logical operator" />
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
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold">Validation Rules</h2>
              <UiButton
                type="button"
                variant="outline"
                size="sm"
                class="bg-white text-black"
                :disabled="isLoading"
                @click="addValidationRule"
              >
                <Icon name="material-symbols:add" class="mr-2 h-4 w-4" />
                Add Rule
              </UiButton>
            </div>

            <div v-if="!form.values?.validationRules?.length">
              {{
                $nextTick(() => {
                  form.setFieldValue("validationRules", [
                    {
                      operator: null,
                      against: [""],
                      errorMessage: "",
                    },
                  ]);
                })
              }}
            </div>

            <div
              v-for="(rule, index) in form.values.validationRules"
              :key="index"
              class="border p-4 rounded-lg space-y-4"
            >
              <div class="flex justify-end">
                <UiButton
                  type="button"
                  variant="destructive"
                  size="sm"
                  @click="removeValidationRule(index)"
                  :disabled="loading"
                >
                  <Icon
                    name="material-symbols:delete-outline"
                    class="h-4 w-4"
                  />
                </UiButton>
              </div>

              <FormField
                :name="`validationRules.${index}.operator`"
                v-model="rule.operator"
              >
                <FormItem>
                  <FormLabel>Operator</FormLabel>
                  <UiSelect v-model="rule.operator">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue
                          :placeholder="rule.operator || 'Select an operator'"
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
                  <FormMessage />
                </FormItem>
              </FormField>

              <div class="space-y-2">
                <div class="mb-2">
                  Against Values
                  <span class="text-red-500 ml-1">*</span>
                </div>
                <template
                  v-if="getOperatorAgainstFieldCount(rule.operator) > 0"
                >
                  <div v-if="!rule.against?.length">
                    {{ $nextTick(() => addAgainstValue(index)) }}
                  </div>

                  <div
                    v-for="(_, againstIndex) in rule.against || []"
                    :key="againstIndex"
                    class="flex gap-2"
                  >
                    <FormField
                      :name="`validationRules.${index}.against.${againstIndex}`"
                      :model-value="rule.against[againstIndex]"
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
                            v-model="rule.against[againstIndex]"
                            type="text"
                            :placeholder="
                              getPlaceholder(rule.operator, againstIndex)
                            "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <!-- Show remove button for extra fields or IN/NIN operators -->
                    <UiButton
                      v-if="
                        (getOperatorAgainstFieldCount(rule.operator) === 1 &&
                          againstIndex > 0) ||
                        (getOperatorAgainstFieldCount(rule.operator) === -1 &&
                          rule.against.length > 1)
                      "
                      type="button"
                      variant="destructive"
                      class="self-end"
                      size="sm"
                      @click="removeAgainstValue(index, againstIndex)"
                    >
                      <Icon
                        name="material-symbols:delete-outline"
                        class="h-4 w-4"
                      />
                    </UiButton>
                  </div>

                  <!-- Add value button -->
                  <UiButton
                    v-if="
                      getOperatorAgainstFieldCount(rule.operator) === -1 ||
                      (getOperatorAgainstFieldCount(rule.operator) === 2 &&
                        (!rule.against || rule.against.length < 2))
                    "
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="addAgainstValue(index)"
                  >
                    <Icon name="material-symbols:add" class="mr-2 h-4 w-4" />
                    Add Value
                  </UiButton>
                </template>
              </div>

              <FormField
                :name="`validationRules.${index}.errorMessage`"
                v-model="rule.errorMessage"
              >
                <FormItem>
                  <FormLabel>Error Message</FormLabel>
                  <FormControl>
                    <UiInput
                      v-model="rule.errorMessage"
                      type="text"
                      placeholder="error message"
                    />
                  </FormControl>
                  <FormMessage />
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
