<script lang="ts" setup>
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { apiOperationErrorValidationFormSchema } from "~/validations/apiOperationErrorValidationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogicalOperators, Operators, LogicalErrorType, DataType } from "@/global-types";
import type { LogicalErrorDefinition, LogicalRule, LogicalRuleGroup, ErrorValidationConfig } from "~/types.d.ts";

const { updateOperationErrorValidation, isLoading } = useOperations();

const props = defineProps<{
  operationIdProps: string;
  errorValidationConfig?: ErrorValidationConfig;
}>();

const emit = defineEmits<{
  (e: "refetch"): void;
}>();

console.log("props", props);

if(props.errorValidationConfig?.logicalErrorDefinitionSet?.length) {
  console.log("props.errorValidationConfig", props.errorValidationConfig);
}

const loading = ref(false);

const defaultLogicalRule = (): LogicalRule => ({
  jsonPath: "",
  operator: Operators.EQ,
  expectedValue: "",
  expectedDataType: DataType.STRING,
  errorCode: "",
  errorMessage: "",
  errorMessageFromPath: false,
});

const defaultLogicalRuleGroup = (): LogicalRuleGroup => ({
  type: LogicalOperators.AND,
  rules: [defaultLogicalRule()],
  errorCode: "",
  errorMessage: "",
  errorMessageFromPath: false,
});

const defaultLogicalErrorDefinition = (): LogicalErrorDefinition => ({
  name: "",
  rollback: false,
  priority: 0,
  logicalErrorType: LogicalErrorType.RULE,
  rule: defaultLogicalRule(),
  ruleGroup: undefined,
});

const form = useForm<ErrorValidationConfig>({
  validationSchema: apiOperationErrorValidationFormSchema,
  initialValues: {
    logicalErrorDefinitionSet: props.errorValidationConfig?.logicalErrorDefinitionSet?.length
      ? JSON.parse(JSON.stringify(props.errorValidationConfig.logicalErrorDefinitionSet))
      : [defaultLogicalErrorDefinition()],
  },
});

watch(
  () => props.errorValidationConfig,
  (newConfig) => {
    if (newConfig) {
      form.setValues({
        logicalErrorDefinitionSet: newConfig.logicalErrorDefinitionSet.length
          ? JSON.parse(JSON.stringify(newConfig.logicalErrorDefinitionSet))
          : [defaultLogicalErrorDefinition()],
      });
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => form.values.logicalErrorDefinitionSet.map(def => def.logicalErrorType),
  (newTypes, oldTypes) => {
    form.values.logicalErrorDefinitionSet.forEach((def, idx) => {
      if (newTypes[idx] === LogicalErrorType.RULE_GROUP && !def.ruleGroup) {
        def.ruleGroup = defaultLogicalRuleGroup();
        def.rule = undefined;
      } else if (newTypes[idx] === LogicalErrorType.RULE && !def.rule) {
        def.rule = defaultLogicalRule();
        def.ruleGroup = undefined;
      }
    });
  },
  { deep: true }
);

const addLogicalErrorDefinition = () => {
  form.setFieldValue("logicalErrorDefinitionSet", [
    ...form.values.logicalErrorDefinitionSet,
    defaultLogicalErrorDefinition(),
  ]);
};

const removeLogicalErrorDefinition = (index: number) => {
  const defs = [...form.values.logicalErrorDefinitionSet];
  defs.splice(index, 1);
  form.setFieldValue("logicalErrorDefinitionSet", defs);
};

const addRuleToGroup = (group: LogicalRuleGroup) => {
  group.rules.push(defaultLogicalRule());
};

const removeRuleFromGroup = (group: LogicalRuleGroup, ruleIdx: number) => {
  group.rules.splice(ruleIdx, 1);
};

const onSubmit = form.handleSubmit(async (values: any) => {
  loading.value = true;
  try {
    console.log("values", values);
    await updateOperationErrorValidation(props.operationIdProps, {
      logicalErrorDefinitionSet: values.logicalErrorDefinitionSet,
    });    toast({
      title: "Error",
      description: "Failed to update error validation.",
      variant: "destructive",
    });
    toast({
      title: "Success",
      description: "Error validation updated successfully.",
    });
    emit("refetch");
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <UiSheet>
    <form @submit="onSubmit" class="space-y-4">
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Error Validation</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4 text-foreground">
          <div
            v-for="(def, idx) in form.values.logicalErrorDefinitionSet"
            :key="idx"
            class="bord p- rounded-lg space-y-4"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-bold">Logical Error Definition #{{ idx + 1 }}</h3>
              <UiButton
              type="button"
                variant="destructive"
                size="sm"
                @click="removeLogicalErrorDefinition(idx)"
                v-if="form.values.logicalErrorDefinitionSet.length > 1"
                    >
                      <Icon
                        name="material-symbols:delete-outline"
                        class="h-4 w-4"
                      />
                    </UiButton>
            </div>

            <FormField :name="`logicalErrorDefinitionSet.${idx}.name`" v-slot="{ componentField, errorMessage }">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <UiInput v-bind="componentField" v-model="def.name" placeholder="Name" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
<div class="grid grid-cols-2 gap-4">

            <FormField :name="`logicalErrorDefinitionSet.${idx}.priority`" v-slot="{ componentField, errorMessage }">
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <UiInput v-bind="componentField" v-model.number="def.priority" type="number" placeholder="Priority" />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField :name="`logicalErrorDefinitionSet.${idx}.rollback`" v-slot="{ componentField, errorMessage }">
              <FormItem 
              class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
                <FormLabel>Rollback</FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="def.rollback"
                    @update:checked="def.rollback = !def.rollback"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>

            <FormField :name="`logicalErrorDefinitionSet.${idx}.logicalErrorType`" v-slot="{ componentField, errorMessage }">
                <FormItem>
                <FormLabel>Logical Error Type</FormLabel>
                    <FormControl>
                  <UiSelect
                    v-bind="componentField"
                    v-model="def.logicalErrorType"
                    @update:modelValue="val => {
                      def.logicalErrorType = val;
                      if (val === LogicalErrorType.RULE_GROUP && !def.ruleGroup) {
                        def.ruleGroup = defaultLogicalRuleGroup();
                        def.rule = undefined;
                      } else if (val === LogicalErrorType.RULE && !def.rule) {
                        def.rule = defaultLogicalRule();
                        def.ruleGroup = undefined;
                      }
                    }"
                  >
                      <UiSelectTrigger>
                      <UiSelectValue placeholder="Select type" />
                      </UiSelectTrigger>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem :value="LogicalErrorType.RULE">RULE</UiSelectItem>
                        <UiSelectItem :value="LogicalErrorType.RULE_GROUP">RULE_GROUP</UiSelectItem>
                      </UiSelectGroup>
                    </UiSelectContent>
                  </UiSelect>
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
                </FormItem>
              </FormField>

            <!-- RULE -->
            <template v-if="def.logicalErrorType === LogicalErrorType.RULE">
              <div class="border p-4 rounded space-y-4">
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.jsonPath`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>JSON Path</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.rule.jsonPath" placeholder="JSON Path" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.operator`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Operator</FormLabel>
                    <FormControl>
                      <UiSelect v-bind="componentField" v-model="def.rule.operator">
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select operator" />
                        </UiSelectTrigger>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem v-for="op in Object.values(Operators)" :key="op" :value="op">{{ op }}</UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.expectedValue`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Expected Value</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.rule.expectedValue" placeholder="Expected Value" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.expectedDataType`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Expected Data Type</FormLabel>
                    <FormControl>
                      <UiSelect v-bind="componentField" v-model="def.rule.expectedDataType">
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select data type" />
                        </UiSelectTrigger>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem v-for="dt in Object.values(DataType)" :key="dt" :value="dt">{{ dt }}</UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.errorCode`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Code</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.rule.errorCode" placeholder="Error Code" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.errorMessage`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Message</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.rule.errorMessage" placeholder="Error Message" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.rule.errorMessageFromPath`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Message From Path</FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="def.rule.errorMessageFromPath"
                        @update:checked="def.rule.errorMessageFromPath = !def.rule.errorMessageFromPath"
                      />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                </div>
            </template>

            <!-- RULE_GROUP -->
            <template v-else>
              <div class="border p-4 rounded space-y-4">
                <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.type`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Group Type</FormLabel>
                    <FormControl>
                      <UiSelect v-bind="componentField" v-model="def.ruleGroup.type">
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select group type" />
                        </UiSelectTrigger>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem v-for="op in Object.values(LogicalOperators)" :key="op" :value="op">{{ op }}</UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.errorCode`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Code</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.ruleGroup.errorCode" placeholder="Error Code" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.errorMessage`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Message</FormLabel>
                    <FormControl>
                      <UiInput v-bind="componentField" v-model="def.ruleGroup.errorMessage" placeholder="Error Message" />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.errorMessageFromPath`" v-slot="{ componentField, errorMessage }">
                  <FormItem>
                    <FormLabel>Error Message From Path</FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="def.ruleGroup.errorMessageFromPath"
                        @update:checked="def.ruleGroup.errorMessageFromPath = !def.ruleGroup.errorMessageFromPath"
                      />
                    </FormControl>
                    <FormMessage>{{ errorMessage }}</FormMessage>
                  </FormItem>
                </FormField>
                <div>
                  <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold">Rules</h2>
              <UiButton
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="addRuleToGroup(def.ruleGroup)"
                  >
                  <Icon name="material-symbols:add" class="mr-2 h-4 w-4" />
                    Add Rule
                  </UiButton>
            </div>
                  <div
                    v-for="(rule, ruleIdx) in def.ruleGroup.rules"
                    :key="ruleIdx"
                    class="border p-4 my-2 rounded space-y-4"
                  >
                  <div class="flex justify-end">
                    <UiButton
                    type="button"
                      variant="destructive"
                      size="sm"
                      @click="removeRuleFromGroup(def.ruleGroup, ruleIdx)"
                      v-if="def.ruleGroup.rules.length > 1"
                    >
                      <Icon
                        name="material-symbols:delete-outline"
                        class="h-4 w-4"
                      />
                    </UiButton>
                  </div>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.jsonPath`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>JSON Path</FormLabel>
                        <FormControl>
                          <UiInput v-bind="componentField" v-model="rule.jsonPath" placeholder="JSON Path" />
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.operator`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Operator</FormLabel>
                        <FormControl>
                          <UiSelect v-bind="componentField" v-model="rule.operator">
                            <UiSelectTrigger>
                              <UiSelectValue placeholder="Select operator" />
                            </UiSelectTrigger>
                            <UiSelectContent>
                              <UiSelectGroup>
                                <UiSelectItem v-for="op in Object.values(Operators)" :key="op" :value="op">{{ op }}</UiSelectItem>
                              </UiSelectGroup>
                            </UiSelectContent>
                          </UiSelect>
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.expectedValue`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Expected Value</FormLabel>
                        <FormControl>
                          <UiInput v-bind="componentField" v-model="rule.expectedValue" placeholder="Expected Value" />
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.expectedDataType`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Expected Data Type</FormLabel>
                        <FormControl>
                          <UiSelect v-bind="componentField" v-model="rule.expectedDataType">
                            <UiSelectTrigger>
                              <UiSelectValue placeholder="Select data type" />
                            </UiSelectTrigger>
                            <UiSelectContent>
                              <UiSelectGroup>
                                <UiSelectItem v-for="dt in Object.values(DataType)" :key="dt" :value="dt">{{ dt }}</UiSelectItem>
                              </UiSelectGroup>
                            </UiSelectContent>
                          </UiSelect>
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.errorCode`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Error Code</FormLabel>
                        <FormControl>
                          <UiInput v-bind="componentField" v-model="rule.errorCode" placeholder="Error Code" />
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.errorMessage`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Error Message</FormLabel>
                        <FormControl>
                          <UiInput v-bind="componentField" v-model="rule.errorMessage" placeholder="Error Message" />
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                    <FormField :name="`logicalErrorDefinitionSet.${idx}.ruleGroup.rules.${ruleIdx}.errorMessageFromPath`" v-slot="{ componentField, errorMessage }">
                      <FormItem>
                        <FormLabel>Error Message From Path</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="rule.errorMessageFromPath"
                            @update:checked="rule.errorMessageFromPath = !rule.errorMessageFromPath"
                          />
                        </FormControl>
                        <FormMessage>{{ errorMessage }}</FormMessage>
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <UiButton type="button" variant="outline" @click="addLogicalErrorDefinition">
            <Icon name="material-symbols:add" class="mr-2 h-4 w-4" />
            Add Logical Error Definition
          </UiButton>
      </UiSheetDescription>
    </UiSheetHeader>
    <UiSheetFooter class="flex justify-end gap-4 mt-auto">
      <UiSheetClose asChild>
        <UiButton :disabled="loading" variant="outline">Cancel</UiButton>
      </UiSheetClose>
      <UiButton :disabled="loading" type="submit">
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="loading"
          class="mr-2 h-4 w-4 animate-spin"
        ></Icon>
        Save changes
      </UiButton>
    </UiSheetFooter>
  </form>
  </UiSheet>
</template>
