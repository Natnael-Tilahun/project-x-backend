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
import { getIdFromPath } from "~/lib/utils";
import type { ChargeRule } from "~/types";

const { getChargeRuleById, updateChargeRule } = await useCharges();

const isError = ref(false);
const loading = ref(false);
const data = ref<ChargeRule>();
const chargeId = ref<string>("");
const chargeRuleId = ref<number>();
const route = useRoute();

chargeId.value = getIdFromPath();

if (route.query.chargeRuleId) {
  chargeRuleId.value = route.query.chargeRuleId as unknown as number;
}

const isSubmitting = ref(false);

const form = useForm({
  validationSchema: chargeRuleFormSchema,
});

const fetchChargeData = async () => {
  try {
    loading.value = true;
    if (chargeRuleId.value) {
      const response = await getChargeRuleById(chargeRuleId.value);
      data.value = response;
    }
    if (data.value) {
      form.setValues(data.value);
    }
  } catch (err) {
    console.error("Error fetching charge rules:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchChargeData();
});

const refetch = async () => {
  await fetchChargeData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const data = {
      ...values,
      charges: {
        id: chargeId.value,
      },
    };
    if (!chargeRuleId.value) {
      console.error("Charge rule ID is not defined");
      return;
    }
    data.value = await updateChargeRule(chargeRuleId.value, data);
    form.setValues({
      ...data.value,
    });
    toast({
      title: "Charge rule Updated",
      description: "Charge rule data updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating charge rule data:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <UiCard
      v-else-if="data && !isError"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
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
              v-if="
                form.values.ruleType == RuleType.FIXED ||
                form.values.ruleType == RuleType.PERCENTAGE
              "
              v-slot="{ componentField }"
              name="amountRangeStart"
            >
              <FormItem class="w-full">
                <FormLabel> Amount Range Start </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    step="any"
                    placeholder="Enter amount range start"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-if="
                form.values.ruleType == RuleType.FIXED ||
                form.values.ruleType == RuleType.PERCENTAGE
              "
              v-slot="{ componentField }"
              name="amountRangeEnd"
            >
              <FormItem class="w-full">
                <FormLabel>Amount Range End</FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    step="any"
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
                    step="any"
                    placeholder="Enter fixed amount"
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
                    min="0"
                    step="any"
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
            <UiPermissionGuard permission="UPDATE_CHARGE_RULES">
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

                  Update
                </UiButton>
              </div>
            </UiPermissionGuard>
          </div>
        </form>
      </div>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No application found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
