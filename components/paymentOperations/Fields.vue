<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { formFieldsFormSchema } from "~/validations/formFieldsFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DataType,
  TransferMapping,
  Width,
  InterfaceType,
  Display,
} from "@/global-types";

const route = useRoute();
const {
  getFieldById,
  updateField,
  deleteField,
  createNewField,
  isSubmitting,
  isLoading,
} = useFields();
const { getFormById } = useForms();

const loading = ref(isLoading.value);
const isDeleting = ref(false);
const isError = ref(false);
const formId = ref<string>("");

// Initialize formId and operationId from both route and props
const props = defineProps<{
  fields?: Field[];
  formIdProps?: string;
}>();

// Set operationId and formId with priority to props over route
formId.value = props?.formIdProps || (route.query.formId as string) || "";

const fields = ref<Field[]>(props?.fields || []);
const form = useForm<Field>({
  validationSchema: formFieldsFormSchema,
});

console.log("fields: ", fields.value);

// Modify getFormData to check for formId before making the request
const getFormData = async () => {
  try {
    if (!formId.value) {
      console.warn("Form ID is not available");
      toast({
        title: "Form ID is required",
        description:
          "Please provide a form ID. If you don't have a form ID, please create a new form first.",
        variant: "destructive",
      });
      return;
    }
    const data = await getFormById(formId.value);
    fields.value = data.fields || [];
    console.log("fields: ", fields.value);
  } catch (err) {
    console.error("Error fetching form fields:", err);
    toast({
      title: "Error",
      description: "Failed to fetch form fields",
      variant: "destructive",
    });
  }
};

// Only fetch data if formId is available
if (formId.value) {
  await useAsyncData("formData", async () => {
    await getFormData();
  });
}

// Update existing parameter
const onSubmit = form.handleSubmit(async (values: Field) => {
  console.log("valuess: ", values);
  // try {
  //   loading.value = true;
  //   const updatedField = await updateField(values.id, values);

  //   // Update the local state by replacing the updated item
  //   const index = fields.value.findIndex((item) => item.id === values.id);
  //   if (index !== -1) {
  //     fields.value[index] = updatedField;
  //   }

  //   toast({
  //     title: "Field Updated",
  //     description: "Field updated successfully",
  //   });
  // } catch (err: any) {
  //   console.error("Error updating field:", err);
  //   isError.value = true;
  // } finally {
  //   loading.value = false;
  // }
});

// Submit new parameter
const createNewFieldHandler = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    if (!formId.value) {
      throw new Error("Form ID is required");
      toast({
        title: "Form ID is required",
        description: "Please provide a form ID",
        variant: "destructive",
      });
      return;
    }
    const data = {
      ...values,
      form: { id: formId.value },
    };

    const createdField = await createNewField(data);
    // Update the local state by adding the new request input
    fields.value.push(createdField);
    // Reset the newParameter state
    newField.value = null;
    toast({
      title: "Field Created",
      description: "Field created successfully",
    });
    // Reset the form
    form.resetForm();
  } catch (err: any) {
    console.error("Error creating field:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

const deleteFieldHandler = async (id: string) => {
  try {
    isDeleting.value = true;
    await deleteField(id);
    // Update the local state by filtering out the deleted item
    fields.value = fields.value.filter((item) => item.id !== id);
    toast({
      title: "Field Deleted",
      description: "Field deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting field:", err);
    isError.value = true;
  } finally {
    isDeleting.value = false;
  }
};

const newField = ref<Field | null>(null); // To hold the new field data

// Add this new function to check if a parameter has required fields filled
const isFieldFilled = (field: Field) => {
  return field.inputName && field.inputType && field.dataType;
};

// Modify the addNewParameter function
const addNewParameter = () => {
  // Check if there's an existing newParameter and if it's not properly filled
  if (newField.value && !isFieldFilled(newField.value)) {
    toast({
      title: "Incomplete Field",
      description:
        "Please fill in the required fields before adding a new field",
      variant: "destructive",
    });
    return;
  }

  // If previous field was filled, create a new one
  newField.value = {
    defaultLanguageCode: "",
    dataType: "",
    isUnique: false,
    name: "",
    label: "",
    maxLength: null,
    minLength: null,
    minValue: null,
    maxValue: null,
    defaultValue: false,
    isRequired: false,
    readonly: false,
    transferMapping: "",
    sortOrder: null,
    width: null,
    validationPattern: null,
    autoGenerateConfig: null,
    isHidden: false,
    interfaceType: null,
    options: null,
    display: null,
    displayOptions: null,
    validationConfig: null,
    validationMessage: null,
    form: null,
  };
};

watch(
  () => props?.fields,
  (newFields) => {
    if (newFields) {
      fields.value = newFields;
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
      Add Field
    </UiButton>
  </div>

  <UiAccordion type="single" collapsible defaultValue="newField">
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-if="newField"
      value="newField"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        New Field
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 rounded-lg bg-muted">
        <form @submit="createNewFieldHandler">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2"
          >
            <FormField
              :model-value="data?.name"
              v-slot="{ componentField }"
              name="name"
            >
              <FormItem>
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter field name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.label"
              v-slot="{ componentField }"
              name="label"
            >
              <FormItem>
                <FormLabel> Label </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter label"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- <FormField
              :model-value="data?.placeHolder"
              v-slot="{ componentField }"
              name="placeHolder"
            >
              <FormItem>
                <FormLabel> Placeholder </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter placeholder"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <!-- <FormField
              :model-value="data?.note"
              v-slot="{ componentField }"
              name="note"
            >
              <FormItem>
                <FormLabel> Note </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter note"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <FormField
              :model-value="data?.maxLength"
              v-slot="{ componentField }"
              name="maxLength"
            >
              <FormItem>
                <FormLabel> Max Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter max length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.minLength"
              v-slot="{ componentField }"
              name="minLength"
            >
              <FormItem>
                <FormLabel> Min Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter min length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.minValue"
              v-slot="{ componentField }"
              name="minValue"
            >
              <FormItem>
                <FormLabel> Min Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter min value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.maxValue"
              v-slot="{ componentField }"
              name="maxValue"
            >
              <FormItem>
                <FormLabel> Max Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter max value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.width"
              v-slot="{ componentField }"
              name="width"
            >
              <FormItem>
                <FormLabel> Width </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a width" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(Width)"
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
                      <UiSelectValue placeholder="Select a data type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(DataType)"
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
              :model-value="data?.transferMapping"
              v-slot="{ componentField }"
              name="transferMapping"
            >
              <FormItem>
                <FormLabel> Transfer Mapping </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a transfer mapping" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(TransferMapping)"
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
              :model-value="data?.defaultLanguageCode"
              v-slot="{ componentField }"
              name="defaultLanguageCode"
            >
              <FormItem>
                <FormLabel> Default Language Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default language code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.sortOrder"
              v-slot="{ componentField }"
              name="sortOrder"
            >
              <FormItem>
                <FormLabel> Sort Order </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter sort order"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.validationPattern"
              v-slot="{ componentField }"
              name="validationPattern"
            >
              <FormItem>
                <FormLabel> Validation Pattern </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter validation pattern"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.validationMessage"
              v-slot="{ componentField }"
              name="validationMessage"
            >
              <FormItem>
                <FormLabel> Validation Message </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter validation message"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.interfaceType"
              v-slot="{ componentField }"
              name="interfaceType"
            >
              <FormItem>
                <FormLabel> Interface Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a interface type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(InterfaceType)"
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
              :model-value="data?.display"
              v-slot="{ componentField }"
              name="display"
            >
              <FormItem>
                <FormLabel> Display </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a display" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(Display)"
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
              :model-value="data?.displayOptions"
              v-slot="{ componentField }"
              name="displayOptions"
            >
              <FormItem>
                <FormLabel> Display Options </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter display options"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.options"
              v-slot="{ componentField }"
              name="options"
            >
              <FormItem>
                <FormLabel> Options </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter options"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.conditions"
              v-slot="{ componentField }"
              name="conditions"
            >
              <FormItem>
                <FormLabel> Conditions </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter conditions"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.defaultValue"
              v-slot="{ value, handleChange }"
              name="defaultValue"
            >
              <FormItem>
                <FormLabel> Default Value </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.isUnique"
              v-slot="{ value, handleChange }"
              name="isUnique"
            >
              <FormItem>
                <FormLabel> Is Unique </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.isRequired"
              v-slot="{ value, handleChange }"
              name="isRequired"
            >
              <FormItem>
                <FormLabel> Is Required </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.trim"
              v-slot="{ value, handleChange }"
              name="trim"
            >
              <FormItem>
                <FormLabel> Trim </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.readonly"
              v-slot="{ value, handleChange }"
              name="readonly"
            >
              <FormItem>
                <FormLabel> Readonly </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div
            class="col-span-full w-full pt-4 border-t flex justify-end gap-4"
          >
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
              @click="newField = null"
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
      v-for="item in fields"
      :value="item.id"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        {{ item.name }}
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 bg-muted rounded-lg">
        <form @submit="onSubmit">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4"
          >
            <FormField
              :model-value="item?.id"
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
                    readonly="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.name"
              v-slot="{ componentField }"
              name="name"
            >
              <FormItem>
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter field name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.label"
              v-slot="{ componentField }"
              name="label"
            >
              <FormItem>
                <FormLabel> Label </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter label"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- <FormField
              :model-value="item?.placeHolder"
              v-slot="{ componentField }"
              name="placeHolder"
            >
              <FormItem>
                <FormLabel> Placeholder </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter placeholder"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <!-- <FormField
              :model-value="item?.note"
              v-slot="{ componentField }"
              name="note"
            >
              <FormItem>
                <FormLabel> Note </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter note"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <FormField
              :model-value="item?.defaultValue"
              v-slot="{ componentField }"
              name="defaultValue"
            >
              <FormItem>
                <FormLabel> Default Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.maxLength"
              v-slot="{ componentField }"
              name="maxLength"
            >
              <FormItem>
                <FormLabel> Max Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter max length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.minLength"
              v-slot="{ componentField }"
              name="minLength"
            >
              <FormItem>
                <FormLabel> Min Length </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter min length"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.minValue"
              v-slot="{ componentField }"
              name="minValue"
            >
              <FormItem>
                <FormLabel> Min Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter min value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.maxValue"
              v-slot="{ componentField }"
              name="maxValue"
            >
              <FormItem>
                <FormLabel> Max Value </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter max value"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.width"
              v-slot="{ componentField }"
              name="width"
            >
              <FormItem>
                <FormLabel> Width </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a width" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="items in Object.values(Width)"
                        :value="items"
                      >
                        {{ items }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.dataType"
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
                        v-for="type in Object.values(DataType)"
                        :value="type"
                      >
                        {{ type }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.transferMapping"
              v-slot="{ componentField }"
              name="transferMapping"
            >
              <FormItem>
                <FormLabel> Transfer Mapping </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a transfer mapping" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="param in Object.values(TransferMapping)"
                        :value="param"
                      >
                        {{ param }}
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.defaultLanguageCode"
              v-slot="{ componentField }"
              name="defaultLanguageCode"
            >
              <FormItem>
                <FormLabel> Default Language Code </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter default language code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.sortOrder"
              v-slot="{ componentField }"
              name="sortOrder"
            >
              <FormItem>
                <FormLabel> Sort Order </FormLabel>
                <FormControl>
                  <UiInput
                    type="number"
                    placeholder="Enter sort order"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.validationPattern"
              v-slot="{ componentField }"
              name="validationPattern"
            >
              <FormItem>
                <FormLabel> Validation Pattern </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter validation pattern"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.validationMessage"
              v-slot="{ componentField }"
              name="validationMessage"
            >
              <FormItem>
                <FormLabel> Validation Message </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter validation message"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.interfaceType"
              v-slot="{ componentField }"
              name="interfaceType"
            >
              <FormItem>
                <FormLabel> Interface Type </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a interface type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(InterfaceType)"
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
              :model-value="data?.display"
              v-slot="{ componentField }"
              name="display"
            >
              <FormItem>
                <FormLabel> Display </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a display" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem
                        v-for="item in Object.values(Display)"
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
              :model-value="item?.conditions"
              v-slot="{ componentField }"
              name="conditions"
            >
              <FormItem>
                <FormLabel> Conditions </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter conditions"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.isUnique"
              v-slot="{ value, handleChange }"
              name="isUnique"
            >
              <FormItem>
                <FormLabel> Is Unique </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.isRequired"
              v-slot="{ value, handleChange }"
              name="isRequired"
            >
              <FormItem>
                <FormLabel> Is Required </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.trim"
              v-slot="{ value, handleChange }"
              name="trim"
            >
              <FormItem>
                <FormLabel> Trim </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item?.readonly"
              v-slot="{ value, handleChange }"
              name="readonly"
            >
              <FormItem>
                <FormLabel> Readonly </FormLabel>
                <FormControl>
                  <UiSwitch :checked="value" @update:checked="handleChange" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <UiSheet>
              <UiSheetTrigger>
                <UiButton variant="outline" type="button" size="sm">
                  Options
                </UiButton>
              </UiSheetTrigger>
              <UiSheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
              >
                <PaymentOperationsFieldsOptions :formFieldsProps="item" />
              </UiSheetContent>
            </UiSheet>
            <UiSheet>
              <UiSheetTrigger>
                <UiButton variant="outline" type="button" size="sm">
                  Display Options
                </UiButton>
              </UiSheetTrigger>
              <UiSheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
              >
                <PaymentOperationsFieldsDisplayOptions
                  :formFieldsProps="item"
                />
              </UiSheetContent>
            </UiSheet>
            <UiSheet>
              <UiSheetTrigger>
                <UiButton variant="outline" type="button" size="sm">
                  Auto Generate Config
                </UiButton>
              </UiSheetTrigger>
              <UiSheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
              >
                <PaymentOperationsFieldsAutoGenerateConfig
                  :formFieldsProps="item"
                />
              </UiSheetContent>
            </UiSheet>
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
                  <UiAlertDialogAction @click="deleteFieldHandler(item.id)"
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
      v-if="fields?.length == 0 && !newField"
    >
      No fields
    </div>
  </UiAccordion>
</template>
