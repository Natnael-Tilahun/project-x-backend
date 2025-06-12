<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { chargeRuleFormSchema } from "~/validations/chargeRuleFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { RuleType } from "@/global-types";
import { getIdFromPath, splitPath } from "~/lib/utils";
import type { ChargeRule } from "~/types";

const { createNewChargeRule, isLoading } = await useCharges();

const isError = ref(false);
const data = ref<ChargeRule>();
const chargeId = ref<string>("");
chargeId.value = getIdFromPath();
const isSubmitting = ref(false);

const form = useForm({
  validationSchema: chargeRuleFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const data = {
      ...values,
    };
    data.value = await createNewChargeRule(chargeId.value, data); // Call your API function to fetch profile
    navigateTo(`/charges/${chargeId.value}?activeTab=chargeRules`);
    console.log("New charge rule data; ", data.value);
    toast({
      title: "New Charge Rule Created",
      description: "Charge rule created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new charge rule:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pb-4">
      <h1 class="md:text-2xl text-lg font-medium">Add New Charge Rule</h1>
      <p class="text-sm text-muted-foreground">
        Create new charge rule for the charge
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="ruleType">
              <FormItem class="w-full">
                <FormLabel> Rule Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a rule type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(RuleType)"
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

            <FormField
              v-if="form.values.ruleType == RuleType.FIXED || form.values.ruleType == RuleType.PERCENTAGE"
              v-slot="{ componentField }"
              name="amountRangeStart"
            >
              <FormItem class="w-full">
                <FormLabel> Amount Range Start </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter amount range start"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-if="form.values.ruleType == RuleType.FIXED || form.values.ruleType == RuleType.PERCENTAGE"
              v-slot="{ componentField }"
              name="amountRangeEnd"
            >
              <FormItem class="w-full">
                <FormLabel>Amount Range End</FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter amount range end"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-if="form.values.ruleType == RuleType.FIXED"
              v-slot="{ componentField }"
              name="fixedAmount"
            >
              <FormItem class="w-full">
                <FormLabel>Fixed Amount</FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter fixed amount	"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-if="form.values.ruleType == RuleType.PERCENTAGE"
              v-slot="{ componentField }"
              name="percentage"
            >
              <FormItem class="w-full">
                <FormLabel>Percentage</FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Enter percentage"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="priority">
              <FormItem class="w-full">
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter priority"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="col-span-full w-full py-4 flex justify-between">
              <UiButton
                :disabled="isSubmitting"
                variant="outline"
                type="button"
                @click="$router.go(-1)"
              >
                Cancel
              </UiButton>
              <UiButton :disabled="isSubmitting" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Submit
              </UiButton>
            </div>
          </div>
        </form>
      </div>
    </UiCard>
  </div>
</template>
