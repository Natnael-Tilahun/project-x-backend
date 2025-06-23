<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { formsSchema } from "~/validations/formsSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormType } from "@/global-types";
import type { Form } from "~/types";

const route = useRoute();
const {
  getFormById,
  updateForm,
  deleteForm,
  createNewForm,
  isSubmitting,
  isLoading,
} = useForms();
const { getPaymentOperationById } = usePaymentOperations();

const loading = ref(isLoading.value);
const isDeleting = ref(false);
const isError = ref(false);
const operationId = ref<string>("");
const data = ref<Form>({});
const locals = ref<Local[]>([
  {
    defaultLanguageCode: "en",
    localName: "English",
  },
  {
    defaultLanguageCode: "amh",
    localName: "Amharic",
  },
  {
    defaultLanguageCode: "orm",
    localName: "Oromo",
  },
]);
const selectedLocals = ref<Local[]>([]);
const formForm = useForm<Form>({
  validationSchema: formsSchema,
});
const isNewForm = ref(true);

const props = defineProps<{
  // form?: Form;
  operationIdProps?: string;
}>();

const emit = defineEmits(["refresh"]);

operationId.value =
  props?.operationIdProps || (route.query.operationId as string) || "";

// if (props?.form) {
//   data.value = props?.form;
//   console.log("form: ", props?.form);
//   formForm.setValues(data.value);
//   isNewForm.value = false;
// } else {
//   isNewForm.value = true;
// }

const getFormData = async (operId: string) => {
  try {
    if (!operId) {
      console.warn("Operation ID is not available");
      return;
    }
    loading.value = true;
    const response = await getPaymentOperationById(operId);
    if (response?.form) {
      data.value = response?.form;
      formForm.setValues(data.value);
      isNewForm.value = false;
    } else {
      isNewForm.value = true;
    }
  } catch (err) {
    console.error("Error fetching operaton form:", err);
    toast({
      title: "Error",
      description: "Failed to fetch operation form",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

// Only fetch data if formId is available

onMounted(async () => {
  await getFormData(operationId.value);
});

const onSubmit = formForm.handleSubmit(async (values: Form) => {
  try {
    loading.value = true;
    const formData = {
      ...values,
      paymentOperationId: operationId.value
    };
    if (isNewForm.value) {
      console.log("isNewForm: ", isNewForm.value);
      const response = await createNewForm(formData);
      data.value = response;
      formForm.setValues({
        ...response,
        paymentOperationId: response?.paymentOperationId,
      });
      openItems.value = "fields";
      console.log("response: ", response);
      route.query.formId = response.id;
      isNewForm.value = false;
      toast({
        title: "Form Created",
        description: "Form created successfully",
      });
    } else {
      console.log("isNewForm: ", isNewForm.value);
      const response = await updateForm(data.value.id, formData);
      data.value = response;
      formForm.setValues({
        ...response,
        paymentOperation: response.paymentOperation?.id,
      });
      openItems.value = "fields";
      route.query.formId = response.id;
      toast({
        title: "Form Updated",
        description: "Form updated successfully",
      });
    }
  } catch (err: any) {
    console.error("Error updating form:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

// watch(
//   () => operationId.value,
//   async (newFormId) => {
//     if (!newFormId) return;
//     const newFormData = await getFormData(newFormId);
//     data.value = newFormData;
//     formForm.setValues(data.value);
//     selectedLocals.value = locals.value.filter((local) =>
//       newFormData.locals?.includes(local.defaultLanguageCode)
//     );
//   },
//   { immediate: true }
// );

const handleDeleteForm = async () => {
  if (!data.value.id) {
    return;
  }
  try {
    isDeleting.value = true;
    await deleteForm(data.value.id);
    toast({
      title: "Form Deleted",
      description: "Form deleted successfully",
    });
    formForm.resetForm();
    emit("refresh");
    // window.location.reload();
  } catch (err: any) {
    console.error("Error deleting form:", err);
    toast({
      title: "Error Deleting Form",
      description: "Error deleting form",
    });
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <div v-if="loading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <form v-else @submit="onSubmit">
    <div class="grid grid-cols-2 gap-6">
      <FormField :model-value="data?.id" v-slot="{ componentField }" name="id">
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
        :model-value="data?.formName"
        v-slot="{ componentField }"
        name="formName"
      >
        <FormItem>
          <FormLabel> Form Name </FormLabel>
          <FormControl>
            <UiInput
              type="text"
              placeholder="Enter form name"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        :model-value="data?.formDescription"
        v-slot="{ componentField }"
        name="formDescription"
      >
        <FormItem>
          <FormLabel> Form Description </FormLabel>
          <FormControl>
            <UiInput
              type="text"
              placeholder="Enter form description"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        :model-value="data?.formType"
        v-slot="{ componentField }"
        name="formType"
      >
        <FormItem>
          <FormLabel> Form Type </FormLabel>
          <UiSelect v-bind="componentField">
            <FormControl>
              <UiSelectTrigger>
                <UiSelectValue placeholder="Select a form type" />
              </UiSelectTrigger>
            </FormControl>
            <UiSelectContent>
              <UiSelectGroup>
                <UiSelectItem
                  v-for="item in Object.values(FormType)"
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
        :model-value="data?.stepOrder"
        v-slot="{ componentField }"
        name="stepOrder"
      >
        <FormItem>
          <FormLabel> Step Order </FormLabel>
          <FormControl>
            <UiInput
              type="number"
              placeholder="Enter step order"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- <FormField
        :model-value="data?.locals"
        v-slot="{ componentField, errorMessage }"
        name="locals"
      >
        <FormItem>
          <FormLabel> Locals </FormLabel>
          <UiPopover>
            <UiPopoverTrigger asChild>
              <FormControl>
                <div
                  variant="outline"
                  role="combobox"
                  class="w-full text-sm text-left border h-10 flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
                  :class="{
                    'text-muted-foreground': !selectedLocals?.length,
                  }"
                >
                  {{
                    selectedLocals?.length
                      ? selectedLocals
                          .map((local) => local.localName)
                          .join(", ")
                      : "Select locals"
                  }}
                  <Icon
                    name="material-symbols:unfold-more-rounded"
                    class="ml-2 h-4 w-4 shrink-0 opacity-50"
                  ></Icon>
                </div>
              </FormControl>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-[200px] p-0">
              <UiCommand>
                <UiCommandInput
                  class="text-xs"
                  placeholder="Search locals ..."
                />
                <UiCommandList>
                  <UiCommandEmpty> No locals found. </UiCommandEmpty>
                  <UiCommandGroup>
                    <UiCommandItem
                      v-for="local in locals"
                      :key="local.id"
                      :value="local.localName"
                      @select="
                        () => {
                          const isSelected = selectedLocals.some(
                            (selected) =>
                              selected.defaultLanguageCode ===
                              local.defaultLanguageCode
                          );

                          if (isSelected) {
                            selectedLocals = selectedLocals.filter(
                              (selected) =>
                                selected.defaultLanguageCode !==
                                local.defaultLanguageCode
                            );
                          } else {
                            selectedLocals.push(local);
                          }

                          formForm.setFieldValue(
                            'locals',
                            selectedLocals.map(
                              (local) => local.defaultLanguageCode
                            )
                          );
                        }
                      "
                    >
                      {{ local.localName }}
                      <UiCheckbox
                        :checked="
                          selectedLocals.some(
                            (selected) =>
                              selected.defaultLanguageCode ===
                              local.defaultLanguageCode
                          )
                        "
                        class="ml-auto"
                      />
                    </UiCommandItem>
                  </UiCommandGroup>
                </UiCommandList>
              </UiCommand>
            </UiPopoverContent>
          </UiPopover>
          <FormMessage />
        </FormItem>
      </FormField> -->

      <div class="col-span-full w-full py-4 flex justify-end gap-4">
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
              :disabled="loading || isDeleting"
              variant="destructive"
              type="button"
              v-if="!isNewForm"
              size="sm"
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
              <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
              <UiAlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                request input and remove your data from our servers.
              </UiAlertDialogDescription>
            </UiAlertDialogHeader>
            <UiAlertDialogFooter>
              <UiAlertDialogCancel>Cancel</UiAlertDialogCancel>
              <UiAlertDialogAction @click="handleDeleteForm"
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

          {{ isNewForm ? "Create" : "Update" }}
        </UiButton>
      </div>
    </div>
  </form>
</template>
