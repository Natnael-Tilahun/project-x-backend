<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { toast } from "~/components/ui/toast";
import { formFieldsOptionsFormSchema } from "~/validations/formFieldsOptionsFormSchema";
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
  AutoCompleteTrigger,
  InterfaceType,
} from "@/global-types";
import IconPicker from "~/components/IconPicker.vue";
import type { Field } from "~/types";


const showPicker = ref(false);
const route = useRoute();
const { updateField } = useFields();

const fieldId = ref<string>("");
const loading = ref(false);
const submitting = ref(false);
const formFields = ref<Field>();
const isError = ref(false);
const formFieldsProps = defineProps<{
  formFieldsProps: Field;
  options?: Partial<Field>;
}>();

const emit = defineEmits(["refresh"]);
const openNewUserModal = ref(false);

const setOpenNewUserModal = (value: boolean) => {
  openNewUserModal.value = value;
};

formFields.value = formFieldsProps.formFieldsProps;
const data = ref<Partial<Field>>(formFieldsProps.options);
const interfaceType = ref<string>(
  formFieldsProps?.formFieldsProps?.interfaceType
);

const form = useForm({
  validationSchema: formFieldsOptionsFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isError.value = false;
    const updatedValues = {
      ...formFields.value,
      options: {
        ...values,
      },
    };
    const updatedField = await updateField(formFields.value.id, updatedValues);
    console.log("updatedValues: ", updatedField);
    form.setValues(updatedField.options);
    data.value = updatedField.options;
    //   data.value = await updateAuthConfig(values.id, updatedValues); // Call your API function to fetch profile
    //   navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Options Updated",
      description: "Options updated successfully",
    });
    emit("refresh");
  } catch (err: any) {
    console.error("Error updating options:", err);
    isError.value = true;
  } finally {
    submitting.value = false;
    isError.value = false;
  }
});

watch(
  () => formFieldsProps?.options,
  (newOptions) => {
    if (newOptions) {
      // Deep clone the options to ensure we have a fresh copy
      data.value = JSON.parse(JSON.stringify(newOptions));
      // Update form values with the cloned data
      form.setValues(data.value);
    }
  },
  { immediate: true, deep: true }
);

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
      <UiSheetTitle class="border-b-2">Options</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col gap-6 items-center">
          <div v-if="loading" class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center">
            <UiLoading />
          </div>
          <UiCard v-else-if="!isError" class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6 w-full">
                <FormField v-slot="{ componentField }" name="placeholder">
                  <FormItem>
                    <FormLabel> Placeholder </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter placeholder" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="font">
                  <FormItem>
                    <FormLabel> Font </FormLabel>
                    <FormControl>
                      <UiInput type="text" placeholder="Enter font" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <!-- <FormField v-slot="{ componentField }" name="iconLeft">
                  <FormItem>
                    <FormLabel> Icon Left </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter icon left"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField> -->

                <div class="col-span-full">
                  <FormField v-slot="{ field }" name="iconLeft">
                    <FormItem>
                      <FormLabel>Icon Left</FormLabel>
                      <FormControl>
                        <IconPicker :model-value="field.value" @update:modelValue="field.onChange"
                          @select="field.onChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <FormField :model-value="data?.clear" v-slot="{ value, handleChange }" name="clear">
                  <FormItem>
                    <FormLabel> Clear </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField :model-value="data?.trim" v-slot="{ value, handleChange }" name="trim">
                  <FormItem>
                    <FormLabel> Trim </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.masked" v-slot="{ value, handleChange }" name="masked">
                  <FormItem>
                    <FormLabel> Masked </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField :model-value="data?.slug" v-slot="{ value, handleChange }" name="slug">
                  <FormItem>
                    <FormLabel> Slug </FormLabel>
                    <FormControl>
                      <UiSwitch :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <template v-if="
                  interfaceType == InterfaceType.SELECT_DROPDOWN ||
                  interfaceType == InterfaceType.SELECT_RADIO
                ">
                  <div class="col-span-full border p-4 rounded-md space-y-4">
                    <div class="flex justify-between items-center">
                      <h1 class="text-lg font-semibold">Choices</h1>
                      <div class="gap-4 flex items-center">
                        <UiAlertDialog :open="openNewUserModal" :onOpenChange="setOpenNewUserModal">
                          <UiAlertDialogTrigger class="self-end">
                            <UiButton type="button" variant="secondary" size="sm" class="w-full border"
                              @click="setOpenNewUserModal(true)">
                              Import and Preview Choices</UiButton>
                          </UiAlertDialogTrigger>
                          <UiAlertDialogContent class="sm:min-w-max h-[100%] overflow-y-auto p-6">
                            <UiButton type="button" @click="setOpenNewUserModal(false)" variant="outline"
                              class="absolute right-8 top-2">
                              <Icon name="material-symbols:close" class="h-4 w-4 mx-auto"></Icon>
                            </UiButton>
                            <PaymentOperationsImportOptions @close="setOpenNewUserModal(false)"
                              :choices="form.values.choices"
                              :update-choices="(choices) => form.setFieldValue('choices', choices)" />
                          </UiAlertDialogContent>
                        </UiAlertDialog>

                        <UiButton type="button" size="sm" @click="
                          () => {
                            const choices = form.values.choices || [];
                            form.setFieldValue('choices', [
                            {
                                text: '',
                                value: '',
                                icon: '',
                                color: '',
                                isDefault: false,
                              },
                              ...choices,
                            ]);
                          }
                        ">
                          Add New Choice
                        </UiButton>
                      </div>

                    </div>

                    <div v-for="(choice, index) in form.values.choices || [
                      {
                        text: '',
                        value: '',
                        icon: '',
                        color: '',
                        isDefault: false,
                      },
                    ]" :key="index" class="grid grid-cols-2 gap-4 px-4 py-6 border rounded-md relative">
                      <UiButton type="button" variant="ghost" size="icon" class="absolute right-1 top-1" @click="
                        () => {
                          const choices = [...(form.values.choices || [])];
                          choices.splice(index, 1);
                          form.setFieldValue('choices', choices);
                        }
                      ">
                        <Icon name="lucide:x" class="h-5 text-red-500 border border-red-500 rounded-md w-5" />
                      </UiButton>

                      <FormField :name="`choices.${index}.text`" v-slot="{ componentField }">
                        <FormItem>
                          <FormLabel>Text</FormLabel>
                          <FormControl>
                            <UiInput type="text" placeholder="Enter text" v-bind="componentField" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField :name="`choices.${index}.value`" v-slot="{ componentField }">
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <UiInput type="text" placeholder="Enter value" v-bind="componentField" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField :name="`choices.${index}.icon`" v-slot="{ componentField }">
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <UiInput type="text" placeholder="Enter icon" v-bind="componentField" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField :name="`choices.${index}.color`" v-slot="{ componentField }">
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <div class="flex gap-2">
                              <UiInput type="color" class="w-1/3" v-bind="componentField" />
                              <UiInput type="text" placeholder="Enter color" v-bind="componentField" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField :name="`choices.${index}.isDefault`" v-slot="{ value, handleChange }">
                        <FormItem>
                          <FormLabel>Is Default</FormLabel>
                          <FormControl>
                            <UiSwitch :checked="value" @update:checked="handleChange" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                    </div>
                  </div>
                  <FormField :model-value="data?.allowOther" v-slot="{ value, handleChange }" name="allowOther">
                    <FormItem>
                      <FormLabel> Allow Other </FormLabel>
                      <FormControl>
                        <UiSwitch :checked="value" @update:checked="handleChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField :model-value="data?.allowNone" v-slot="{ value, handleChange }" name="allowNone">
                    <FormItem>
                      <FormLabel> Allow None </FormLabel>
                      <FormControl>
                        <UiSwitch :checked="value" @update:checked="handleChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="interfaceType == InterfaceType.INPUT_AUTOCOMPLETE_API">
                  <FormField v-slot="{ componentField }" name="url">
                    <FormItem>
                      <FormLabel>
                        URL <span class="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <UiInput type="text" placeholder="Enter url" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="resultsPath">
                    <FormItem>
                      <FormLabel>
                        Results Path <span class="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <UiInput type="text" placeholder="Enter results path" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField :model-value="data?.autoCompleteTrigger" v-slot="{ componentField }"
                    name="autoCompleteTrigger">
                    <FormItem>
                      <FormLabel>
                        Auto Complete Trigger
                        <span class="text-red-500">*</span>
                      </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select an auto complete trigger" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem v-for="item in Object.values(AutoCompleteTrigger)" :key="item" :value="item">
                              {{ item }}
                            </UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                    </FormItem>
                  </FormField>
                </template>

                <template v-if="interfaceType == InterfaceType.SLIDER">
                  <FormField v-slot="{ componentField }" name="minValue">
                    <FormItem>
                      <FormLabel> Min Value </FormLabel>
                      <FormControl>
                        <UiInput type="number" placeholder="Enter min value" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="maxValue">
                    <FormItem>
                      <FormLabel> Max Value </FormLabel>
                      <FormControl>
                        <UiInput type="number" placeholder="Enter max value" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="stepInterval">
                    <FormItem>
                      <FormLabel> Step Interval </FormLabel>
                      <FormControl>
                        <UiInput type="number" placeholder="Enter step interval" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField :model-value="data?.alwaysShowValue" v-slot="{ value, handleChange }"
                    name="alwaysShowValue">
                    <FormItem>
                      <FormLabel> Always Show Value </FormLabel>
                      <FormControl>
                        <UiSwitch :checked="value" @update:checked="handleChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>

                <div class="col-span-full w-full py-4 flex justify-between">
                  <UiButton :disabled="submitting" variant="outline" type="button" @click="$router.go(-1)">
                    Cancel
                  </UiButton>
                  <UiButton :disabled="submitting" type="submit">
                    <Icon name="svg-spinners:8-dots-rotate" v-if="submitting" class="mr-2 h-4 w-4 animate-spin"></Icon>

                    Update
                  </UiButton>
                </div>
              </div>
            </form>
          </UiCard>
          <div v-else-if="data == null || data == undefined">
            <UiNoResultFound class="w-full" title="Sorry, No auth config found." />
          </div>
          <div v-else-if="isError">
            <ErrorMessage :retry="refetch" class="w-full" title="Something went wrong." />
          </div>
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped>
.absolute>.icon-picker {
  max-height: 100%;
  width: 100%;
  overflow-y: auto;
}

.absolute>.icon-picker::-webkit-scrollbar {
  width: 6px;
}

.absolute>.icon-picker::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.absolute>.icon-picker::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.absolute>.icon-picker::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
