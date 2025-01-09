<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { apiOperationRequestInputValidationRulesFormSchema } from "~/validations/apiOperationRequestInputValidationRulesFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogicalOperators, Operators } from "@/global-types";

interface RequestInputValidations {
  logicalOperator: LogicalOperators;
  validationMessage?: string;
  validationRules?: ValidationRule[];
}

const route = useRoute();
const { updateRequestInput, isLoading } = useOperationRequestInputs();

const loading = ref(isLoading.value);
const isError = ref(false);
const operationId = ref<string>("");
const requestInputId = ref<string>("");
operationId.value = route.query.operationId as string;

const props = defineProps<{
  requestInput?: RequestInput;
  operationIdProps?: string;
}>();

if (props.operationIdProps) {
  operationId.value = props.operationIdProps;
}

console.log("props.requestInput:", props.requestInput);

requestInputId.value = props.requestInput?.id || "";
const requestInputValidationRules = ref<RequestInputValidations>({
  logicalOperator: props.requestInput?.validationConfig?.logicalOperator || "",
  validationMessage: props.requestInput?.validationMessage || "",
  validationRules: props.requestInput?.validationConfig?.validationRules || [
    {
      operator: null,
      against: null,
      errorMessage: null,
    },
  ],
});

// Initialize the form with the existing values or default empty values
const form = useForm<Partial<RequestInput>>({
  validationSchema: apiOperationRequestInputValidationRulesFormSchema,
  initialValues: {
    logicalOperator:
      props.requestInput?.validationConfig?.logicalOperator || null,
    validationRules:
      props.requestInput?.validationConfig &&
      props.requestInput.validationConfig.validationRules?.length
        ? props.requestInput.validationConfig.validationRules
        : [
            {
              operator: null,
              against: null,
              errorMessage: null,
            },
          ],
    validationMessage: props.requestInput?.validationMessage || "",
  },
});

// Update the onSubmit function
const onSubmit = form.handleSubmit(async (values) => {
  console.log(
    "values:",
    values,
    values.validationRules,
    values.validationMessage
  );

  try {
    loading.value = true;
    const updateData = {
      ...props.requestInput,
      id: requestInputId.value,
      validationConfig: {
        validationRules: values.validationRules || [],
        logicalOperator: values.logicalOperator,
      },
      validationMessage: values.validationMessage,
    };

    console.log("Submitting values:", updateData);
    const updatedRequestInput = await updateRequestInput(
      requestInputId.value,
      updateData
    );
    console.log("updatedRequestInput:", updatedRequestInput);

    toast({
      title: "Validation Rules Updated",

      description: "Validation rules updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating validation rules:", err);
    isError.value = true;
    toast({
      title: "Error",
      description: "Failed to update validation rules",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
});

watch(
  () => props.requestInput,
  (newInputs) => {
    if (newInputs) {
      requestInputValidationRules.value = newInputs;
    }
  }
);

console.log("validationRules:", requestInputValidationRules.value);

// Add helper function to check if a rule is filled
const isValidationRuleFilled = (rule: ValidationRule) => {
  return rule.operator && rule.against && rule.errorMessage;
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
      against: null,
      errorMessage: null,
    },
  ]);
};

const removeValidationRule = (index: number) => {
  const currentRules = [...(form.values.validationRules || [])];
  currentRules.splice(index, 1);
  form.setFieldValue("validationRules", currentRules);
};
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Validations</UiSheetTitle>
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

          <!-- Validation Message -->
          <FormField
            v-model="form.values.validationMessage"
            name="validationMessage"
            v-slot="{ field }"
          >
            <FormItem>
              <FormLabel>Validation Message</FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="validation message"
                  v-bind="field"
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
                class="bg-white text-black"
                :disabled="loading"
                @click="addValidationRule"
              >
                <Icon name="material-symbols:add" class="mr-2 h-4 w-4" />
                Add Rule
              </UiButton>
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

              <FormField
                :name="`validationRules.${index}.against`"
                v-model="rule.against"
              >
                <FormItem>
                  <FormLabel>Against</FormLabel>
                  <FormControl>
                    <UiInput
                      v-model="rule.against"
                      type="text"
                      placeholder="against"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

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
