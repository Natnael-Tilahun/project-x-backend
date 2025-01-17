<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { formFieldsDisplayOptionsFormSchema } from "~/validations/formFieldsDisplayOptionsFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import {
  DataType,
  GenerationType,
  DateStepUnit,
  Display,
} from "@/global-types";

const route = useRoute();
const { updateField } = useFields();

const fieldId = ref<string>("");
const loading = ref(false);
const submitting = ref(false);
const formFields = ref<Field>();
const isError = ref(false);
const formFieldsProps = defineProps<{
  formFieldsProps: Field;
  displayOptions?: Partial<Field>;
}>();
formFields.value = formFieldsProps.formFieldsProps;
const data = ref<Partial<Field>>(formFieldsProps?.displayOptions);
const display = ref<string>(formFieldsProps.formFieldsProps?.display);

const form = useForm({
  validationSchema: formFieldsDisplayOptionsFormSchema,
});

if (data.value) {
  form.setValues(data.value);
}

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isError.value = false;
    const updatedValues = {
      ...formFields.value,
      displayOptions: {
        ...values,
      },
    };
    const updatedField = await updateField(formFields.value.id, updatedValues);
    console.log("updatedValues: ", updatedField);
    form.setValues(updatedField.displayOptions);
    data.value = updatedField.displayOptions;

    //   data.value = await updateAuthConfig(values.id, updatedValues); // Call your API function to fetch profile
    //   navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Display Options Updated",
      description: "Display Options updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating display options:", err);
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
      <UiSheetTitle class="border-b-2">Display Options</UiSheetTitle>
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
                <!-- Common display options - always visible -->
                <div class="col-span-full border p-4 rounded-md space-y-4">
                  <h2 class="font-semibold">Common Options</h2>
                  <div class="grid grid-cols-2 gap-6">
                    <FormField v-slot="{ value, handleChange }" name="format">
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" name="bold">
                      <FormItem>
                        <FormLabel>Bold</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="color">
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <div class="flex gap-2">
                            <UiInput
                              type="color"
                              class="w-1/3"
                              v-bind="componentField"
                            />
                            <UiInput
                              type="text"
                              placeholder="Enter color"
                              v-bind="componentField"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="background">
                      <FormItem>
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                          <div class="flex gap-2">
                            <UiInput
                              type="color"
                              class="w-1/3"
                              v-bind="componentField"
                            />
                            <UiInput
                              type="text"
                              placeholder="Enter background"
                              v-bind="componentField"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="icon">
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter icon"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" name="masked">
                      <FormItem>
                        <FormLabel>Masked</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </div>

                <!-- Formatted-value display options -->
                <div
                  v-if="display === Display.FORMATTED_VALUE"
                  class="col-span-full border p-4 rounded-md space-y-4"
                >
                  <h2 class="font-semibold">Formatted Value Options</h2>
                  <div class="grid grid-cols-2 gap-6">
                    <FormField v-slot="{ componentField }" name="prefix">
                      <FormItem>
                        <FormLabel>Prefix</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter prefix"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="suffix">
                      <FormItem>
                        <FormLabel>Suffix</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter suffix"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="font">
                      <FormItem>
                        <FormLabel>Font</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter font"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" name="italic">
                      <FormItem>
                        <FormLabel>Italic</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" name="border">
                      <FormItem>
                        <FormLabel>Border</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </div>

                <!-- Datetime display options -->
                <div
                  v-if="display === Display.DATETIME"
                  class="col-span-full border p-4 rounded-md space-y-4"
                >
                  <h2 class="font-semibold">DateTime Options</h2>
                  <div class="grid grid-cols-2 gap-6">
                    <FormField v-slot="{ value, handleChange }" name="relative">
                      <FormItem>
                        <FormLabel>Relative</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value, handleChange }" name="strict">
                      <FormItem>
                        <FormLabel>Strict</FormLabel>
                        <FormControl>
                          <UiSwitch
                            :checked="value"
                            @update:checked="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </div>

                <!-- Boolean display options -->
                <div
                  v-if="display === Display.BOOLEAN"
                  class="col-span-full border p-4 rounded-md space-y-4"
                >
                  <h2 class="font-semibold">Boolean Options</h2>
                  <div class="grid grid-cols-2 gap-6">
                    <FormField v-slot="{ componentField }" name="labelOn">
                      <FormItem>
                        <FormLabel>Label On</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter label on"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="labelOff">
                      <FormItem>
                        <FormLabel>Label Off</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter label off"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="colorOn">
                      <FormItem>
                        <FormLabel>Color On</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter color on"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="colorOff">
                      <FormItem>
                        <FormLabel>Color Off</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter color off"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="iconOn">
                      <FormItem>
                        <FormLabel>Icon On</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter icon on"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="iconOff">
                      <FormItem>
                        <FormLabel>Icon Off</FormLabel>
                        <FormControl>
                          <UiInput
                            type="text"
                            placeholder="Enter icon off"
                            v-bind="componentField"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </div>

                <!-- Action buttons -->
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
                    />
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
