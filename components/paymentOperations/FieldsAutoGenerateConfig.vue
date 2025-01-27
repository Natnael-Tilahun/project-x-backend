<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { formFieldsAutoGenerateConfigFormSchema } from "~/validations/formFieldsAutoGenerateConfigFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { DataType, GenerationType, DateStepUnit } from "@/global-types";

const route = useRoute();
const { updateField } = useFields();
const { getOperations } = useOperations();

const fieldId = ref<string>("");
const loading = ref(false);
const submitting = ref(false);
const formFields = ref<Field>();
const isError = ref(false);
const formFieldsProps = defineProps<{
  formFieldsProps: Field;
}>();
formFields.value = formFieldsProps.formFieldsProps;
const data = ref<Field>(formFields.value?.autoGenerateConfig);

const form = useForm({
  validationSchema: formFieldsAutoGenerateConfigFormSchema,
});

if (data.value) {
  form.setValues(data.value);
}

// const getAuthConfigDetails = async () => {
//   try {
//     isLoading.value = true;
//     loading.value = true;
//     data.value = await getAuthConfigById(authConfigId.value);
//     form.setValues(data.value);
//   } catch (err) {
//     console.error("Error fetching auth configuration:", err);
//     isError.value = true;
//   } finally {
//     isLoading.value = false;
//     loading.value = false;
//   }
// };

// const getApiOperationsData = async () => {
//   try {
//     allApiOperations.value = await getOperations();
//   } catch (err) {
//     console.error("Error fetching operations:", err);
//   }
// };

// await useAsyncData("paymentIntegrations", () => {
//   getApiOperationsData();
// });

// const refetch = async () => {
//   await getApiOperationsData();
// };

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isError.value = false;
    const updatedValues = {
      ...formFields.value,
      autoGenerateConfig: {
        ...values,
      },
    };
    const updatedField = await updateField(formFields.value.id, updatedValues);
    console.log("updatedValues: ", updatedField);
    form.setValues(updatedField.autoGenerateConfig);
    data.value = updatedField.autoGenerateConfig;

    //   data.value = await updateAuthConfig(values.id, updatedValues); // Call your API function to fetch profile
    //   navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Auto Generate Config Updated",
      description: "Auto Generate Config updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating auto generate config:", err);
    isError.value = true;
  } finally {
    submitting.value = false;
    isError.value = false;
  }
});

// const paramKeys = ref<string[]>([]);

// In your getAuthConfigDetails function, after setting form values:
// watch(
//   () => form.values.additionalParams,
//   (newValue) => {
//     if (
//       newValue &&
//       Object.keys(newValue).length > 0 &&
//       paramKeys.value.length === 0
//     ) {
//       paramKeys.value = Object.keys(newValue);
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Auto Generate Config</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col gap-6 items-center">
          <div
            v-if="loading"
            class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
          >
            <UiLoading />
          </div>
          <UiCard v-else-if="!isError" class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6 w-full">
                <FormField
                  :model-value="data?.enabled"
                  v-slot="{ value, handleChange }"
                  name="enabled"
                >
                  <FormItem>
                    <FormLabel> Enabled </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.generationType"
                  v-slot="{ componentField }"
                  name="generationType"
                >
                  <FormItem>
                    <FormLabel> Generation Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            placeholder="Select an generation type"
                          />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="item in Object.values(GenerationType)"
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
                  :model-value="data?.dataType"
                  v-slot="{ componentField }"
                  name="dataType"
                >
                  <FormItem>
                    <FormLabel> Data Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue placeholder="Select an data type" />
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
                <FormField v-slot="{ componentField }" name="prefix">
                  <FormItem>
                    <FormLabel>Prefix </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter prefix"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="suffix">
                  <FormItem>
                    <FormLabel>Suffix </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter suffix"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="length">
                  <FormItem>
                    <FormLabel> Length </FormLabel>
                    <FormControl>
                      <UiInput
                        type="number"
                        placeholder="Enter length"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.allowManualOverride"
                  v-slot="{ value, handleChange }"
                  name="allowManualOverride"
                >
                  <FormItem>
                    <FormLabel> Allow Manual Override </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.generationType === 'SEQUENTIAL'"
                >
                  <h1 class="col-span-full font-bold">Sequential</h1>
                  <FormField v-slot="{ componentField }" name="minValue">
                    <FormItem>
                      <FormLabel> Min Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter min value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="maxValue">
                    <FormItem>
                      <FormLabel> Max Value </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter max value"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="step">
                    <FormItem>
                      <FormLabel> Step </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter min step"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="data?.padding"
                    v-slot="{ value, handleChange }"
                    name="padding"
                  >
                    <FormItem>
                      <FormLabel> Padding </FormLabel>
                      <FormControl>
                        <UiSwitch
                          :checked="value"
                          @update:checked="handleChange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="paddingLength">
                    <FormItem>
                      <FormLabel> Padding Length </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter padding length "
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    v-model="form.values.reservedValues"
                    v-slot="{ field }"
                    name="reservedValues"
                  >
                    <FormItem>
                      <FormLabel>Reserved Values</FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter comma separated reserved values"
                          :value="
                            Array.isArray(field.value)
                              ? field.value.join(',')
                              : ''
                          "
                          @input="
                            (e) => {
                              const inputValue = e.target.value;
                              const values = inputValue
                                .split(',')
                                .map((v) => v.trim())
                                .filter(Boolean)
                                .map((v) => Number(v))
                                .filter((v) => !isNaN(v)); // Filter out invalid numbers
                              form.setFieldValue('reservedValues', values);
                            }
                          "
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Enter comma separated numbers (e.g., 1,2,3)
                      </FormDescription>
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ field }" name="excludePatterns">
                    <FormItem>
                      <FormLabel>Exclude Patterns</FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter comma separated patterns"
                          :value="
                            Array.isArray(field.value)
                              ? field.value.join(',')
                              : ''
                          "
                          @input="
                            (e) => {
                              const inputValue = e.target.value;
                              const patterns = inputValue
                                .split(',')
                                .map((v) => v.trim())
                                .filter(Boolean);
                              form.setFieldValue('excludePatterns', patterns);
                            }
                          "
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Enter comma separated patterns (e.g.,
                        pattern1,pattern2,pattern3)
                      </FormDescription>
                    </FormItem>
                  </FormField>
                </div>
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.generationType === 'PATTERN_BASED'"
                >
                  <h1 class="col-span-full font-bold">Pattern Based</h1>
                  <FormField v-slot="{ componentField }" name="pattern">
                    <FormItem>
                      <FormLabel> pattern </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter pattern"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="allowedChars">
                    <FormItem>
                      <FormLabel> Allowed Chars </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter allowed chars"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.generationType === 'UUID'"
                >
                  <h1 class="col-span-full font-bold">UUID</h1>
                  <FormField v-slot="{ componentField }" name="uuidVersion">
                    <FormItem>
                      <FormLabel> Uuid Version </FormLabel>
                      <FormControl>
                        <FormControl>
                          <UiInput
                            type="number"
                            placeholder="Enter uuid version"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="uuidNamespace">
                    <FormItem>
                      <FormLabel> Uuid Namespace </FormLabel>
                      <FormControl>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter uuid namespace"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.generationType === 'DATE_TIME'"
                >
                  <h1 class="col-span-full font-bold">Date</h1>
                  <FormField v-slot="{ componentField }" name="startDate">
                    <FormItem>
                      <FormLabel> Start Date </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter start date"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="startDateTime">
                    <FormItem>
                      <FormLabel> Start Date Time </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter start date time"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dateFormat">
                    <FormItem>
                      <FormLabel> Date Format </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter date format"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dateTimeFormat">
                    <FormItem>
                      <FormLabel> Date Time Format </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter date time format"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="timezone">
                    <FormItem>
                      <FormLabel> Timezone </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter timezone"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dateStep">
                    <FormItem>
                      <FormLabel> Date Step </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter date step"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="data?.dateStepUnit"
                    v-slot="{ componentField }"
                    name="dateStepUnit"
                  >
                    <FormItem>
                      <FormLabel> Date Step Unit </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue
                              placeholder="Select an date step unit"
                            />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem
                              v-for="item in Object.values(DateStepUnit)"
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
                </div>
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.generationType === 'DATE'"
                >
                  <h1 class="col-span-full font-bold">Date</h1>
                  <FormField v-slot="{ componentField }" name="startDate">
                    <FormItem>
                      <FormLabel> Start Date </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter start date"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dateFormat">
                    <FormItem>
                      <FormLabel> Date Format </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter date format"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="dateStep">
                    <FormItem>
                      <FormLabel> Date Step </FormLabel>
                      <FormControl>
                        <UiInput
                          type="number"
                          placeholder="Enter date step"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    :model-value="data?.dateStepUnit"
                    v-slot="{ componentField }"
                    name="dateStepUnit"
                  >
                    <FormItem>
                      <FormLabel> Date Step Unit </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue
                              placeholder="Select an date step unit"
                            />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem
                              v-for="item in Object.values(DateStepUnit)"
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
                </div>
                <!-- <FormField
                  :model-value="data?.unique"
                  v-slot="{ value, handleChange }"
                  name="unique"
                >
                  <FormItem>
                    <FormLabel> Unique </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="retryAttempts">
                  <FormItem>
                    <FormLabel> Retry Attempts </FormLabel>
                    <FormControl>
                      <UiInput
                        type="number"
                        placeholder="Enter retry attempts"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="collisionStrategy">
                  <FormItem>
                    <FormLabel> Collision Strategy </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter collision strategy"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.logValues"
                  v-slot="{ value, handleChange }"
                  name="logValues"
                >
                  <FormItem>
                    <FormLabel> Log Values </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.auditEnabled"
                  v-slot="{ value, handleChange }"
                  name="auditEnabled"
                >
                  <FormItem>
                    <FormLabel> Audit Enabled </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.obfuscation"
                  v-slot="{ value, handleChange }"
                  name="obfuscation"
                >
                  <FormItem>
                    <FormLabel> Obfuscation </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.encryption"
                  v-slot="{ value, handleChange }"
                  name="encryption"
                >
                  <FormItem>
                    <FormLabel> Encryption </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="dependentOn">
                  <FormItem>
                    <FormLabel> Dependent On </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter dependent on"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="customRule">
                  <FormItem>
                    <FormLabel> Custom Rule </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter custom rule"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="batchSize">
                  <FormItem>
                    <FormLabel> Batch Size </FormLabel>
                    <FormControl>
                      <UiInput
                        type="number"
                        placeholder="Enter batch size"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="concurrency">
                  <FormItem>
                    <FormLabel> Concurrency </FormLabel>
                    <FormControl>
                      <UiInput
                        type="number"
                        placeholder="Enter concurrency"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="validationRegex">
                  <FormItem>
                    <FormLabel> Validation Regex </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter validation regex"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.postValidation"
                  v-slot="{ value, handleChange }"
                  name="postValidation"
                >
                  <FormItem>
                    <FormLabel> Post Validation </FormLabel>
                    <FormControl>
                      <UiSwitch
                        :checked="value"
                        @update:checked="handleChange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField> -->
                <div class="col-span-full w-full py-4 flex justify-between">
                  <UiButton
                    :disabled="submitting"
                    variant="outline"
                    type="button"
                    @click="$router.go(-1)"
                  >
                    Cancel
                  </UiButton>
                  <UiButton :disabled="submitting" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="submitting"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>

                    Update
                  </UiButton>
                </div>
              </div>
            </form>
          </UiCard>
          <div v-else-if="data == null || data == undefined">
            <UiNoResultFound
              class="w-full"
              title="Sorry, No auth config found."
            />
          </div>
          <div v-else-if="isError">
            <ErrorMessage
              :retry="refetch"
              class="w-full"
              title="Something went wrong."
            />
          </div>
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
