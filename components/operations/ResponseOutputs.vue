<script lang="ts" setup>
const openItems = ref("");
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { apiOperationResponseOutputFormSchema } from "~/validations/apiOperationResponseOutputFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const route = useRoute();

const {
  getResponseOutputById,
  updateResponseOutput,
  deleteResponseOutput,
  createNewResponseOutput,
  isSubmitting,
  isLoading,
} = useOperationResponseOutputs();

const loading = ref(isLoading.value);
const isDeleting = ref(false);
const isError = ref(false);
const operationId = ref<string>("");
operationId.value = route.query.operationId as string;
const props = defineProps<{
  responseOutputs?: ResponseOutput[];
  operationIdProps?: string;
}>();

if (props.operationIdProps) {
  operationId.value = props.operationIdProps;
}

const responseOutputs = ref<ResponseOutput[]>(props.responseOutputs || []);
const form = useForm<ResponseOutput>({
  validationSchema: apiOperationResponseOutputFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const updatedResponseOutput = await updateResponseOutput(values.id, values);

    const index = responseOutputs.value.findIndex(
      (item) => item.id === values.id
    );
    if (index !== -1) {
      responseOutputs.value[index] = updatedResponseOutput;
    }

    toast({
      title: "Response Output Updated",
      description: "Response output updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating response output:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

const onSubmitNewParameter = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const data = {
      ...values,
      apiOperation: { id: operationId.value },
    };
    const createdResponseOutput = await createNewResponseOutput(data);

    responseOutputs.value.push(createdResponseOutput);

    newParameter.value = null;

    toast({
      title: "Response Output Created",
      description: "Response output created successfully",
    });

    form.resetForm();
  } catch (err: any) {
    console.error("Error creating response output:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

const deleteResponseOutputHandler = async (id: string) => {
  try {
    isDeleting.value = true;
    await deleteResponseOutput(id);

    responseOutputs.value = responseOutputs.value.filter(
      (item) => item.id !== id
    );

    toast({
      title: "Response Output Deleted",
      description: "Response output deleted successfully",
    });
  } catch (err: any) {
    console.error("Error deleting response output:", err);
    isError.value = true;
  } finally {
    isDeleting.value = false;
  }
};

const newParameter = ref<ResponseOutput | null>(null);

const addNewParameter = () => {
  if (newParameter.value && !isParameterFilled(newParameter.value)) {
    toast({
      title: "Incomplete Parameter",
      description:
        "Please fill in the required fields before adding a new parameter",
      variant: "destructive",
    });
    return;
  }

  newParameter.value = {
    outputName: "",
    dataType: "",
    responseValuePath: "",
    responseScope: "",
    transferCoreMapping: "",
    isLogicField: false,
    constantValueToCompare: "",
    operatorToCompareValue: "",
    isRequired: false,
    isVisibleForUser: false,
  };
};

const isParameterFilled = (parameter: ResponseOutput) => {
  return parameter.outputName && parameter.dataType && parameter.responseScope;
};

watch(
  () => props.responseOutputs,
  (newOutputs) => {
    if (newOutputs) {
      responseOutputs.value = newOutputs;
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
      Add Parameter
    </UiButton>
  </div>

  <UiAccordion type="single" collapsible defaultValue="newParameter">
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-if="newParameter"
      value="newParameter"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        New Parameter
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 bg-muted rounded-lg">
        <form @submit="onSubmitNewParameter">
          <div
            class="grid xl:grid-cols-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4"
          >
            <FormField
              :model-value="newParameter?.outputName"
              v-slot="{ componentField }"
              name="outputName"
            >
              <FormItem>
                <FormLabel> Output Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="output name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.dataType"
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
                      <UiSelectItem value="STRING"> STRING </UiSelectItem>
                      <UiSelectItem value="INT"> INT </UiSelectItem>
                      <UiSelectItem value="LONG"> LONG </UiSelectItem>
                      <UiSelectItem value="DOUBLE"> DOUBLE </UiSelectItem>
                      <UiSelectItem value="BOOLEAN"> BOOLEAN </UiSelectItem>
                      <UiSelectItem value="DATETIME"> DATETIME </UiSelectItem>
                      <UiSelectItem value="COLLECTION">
                        COLLECTION
                      </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.responseScope"
              v-slot="{ componentField }"
              name="responseScope"
            >
              <FormItem>
                <FormLabel> Response Scope </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a response scope" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="RESPONSE"> RESPONSE </UiSelectItem>
                      <UiSelectItem value="HEADER"> HEADER </UiSelectItem>
                      <UiSelectItem value="ERROR"> ERROR </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.responseValuePath"
              v-slot="{ componentField }"
              name="responseValuePath"
            >
              <FormItem>
                <FormLabel> Response Value Path </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="response value path"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.transferCoreMapping"
              v-slot="{ componentField }"
              name="transferCoreMapping"
            >
              <FormItem>
                <FormLabel> Transfer Core Mapping </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select a transfer core mapping"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="AMOUNT"> AMOUNT </UiSelectItem>
                      <UiSelectItem value="CREDIT_ACCOUNT">
                        CREDIT_ACCOUNT
                      </UiSelectItem>
                      <UiSelectItem value="REASON"> REASON </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.constantValueToCompare"
              v-slot="{ componentField }"
              name="constantValueToCompare"
            >
              <FormItem>
                <FormLabel> Constant Value To Compare </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="constant value to compare"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.operatorToCompareValue"
              v-slot="{ componentField }"
              name="operatorToCompareValue"
            >
              <FormItem>
                <FormLabel> Operator To Compare Value </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select an operator to compare value"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="EQUAL_TO"> EQUAL_TO </UiSelectItem>
                      <UiSelectItem value="NOT_EQUAL_TO">
                        NOT_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="OBJECT_"> OBJECT_ </UiSelectItem>
                      <UiSelectItem value="OBJECT_NOT_EQUAL_TO">
                        OBJECT_NOT_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="GREATER_THAN">
                        GREATER_THAN
                      </UiSelectItem>
                      <UiSelectItem value="LESS_THAN"> LESS_THAN </UiSelectItem>
                      <UiSelectItem value="GREATER_THAN_OR_EQUAL_TO">
                        GREATER_THAN_OR_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="LESS_THAN_OR_EQUAL_TO">
                        LESS_THAN_OR_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isRequired"
              v-slot="{ componentField }"
              name="isRequired"
            >
              <FormItem>
                <FormLabel> Is Required </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isRequired"
                    @update:checked="
                      newParameter.isRequired = !newParameter.isRequired
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isLogicField"
              v-slot="{ componentField }"
              name="isLogicField"
            >
              <FormItem>
                <FormLabel> Is Logic Field </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isLogicField"
                    @update:checked="
                      newParameter.isLogicField = !newParameter.isLogicField
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="newParameter?.isVisibleForUser"
              v-slot="{ componentField }"
              name="isVisibleForUser"
            >
              <FormItem>
                <FormLabel> Is Visible For User </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="newParameter?.isVisibleForUser"
                    @update:checked="
                      newParameter.isVisibleForUser =
                        !newParameter.isVisibleForUser
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div
            class="col-span-full w-full flex justify-end gap-4 pt-4 border-t"
          >
            <UiButton
              :disabled="loading"
              variant="outline"
              type="button"
              size="sm"
              @click="newParameter = null"
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
    <!-- Existing accordion items for responseOutputs -->

    <UiAccordionItem
      class="my-2 border-b-0 space-y-2"
      v-for="item in responseOutputs"
      :value="item?.id"
    >
      <UiAccordionTrigger class="text-lg font-semibold border px-6 rounded-lg">
        {{ item.outputName }}
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-6 px-6 bg-muted rounded-lg w-full">
        <form @submit="onSubmit">
          <div
            class="grid xl:grid-cols-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4"
          >
            <FormField
              :model-value="item.id"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.outputName"
              v-slot="{ componentField }"
              name="outputName"
            >
              <FormItem>
                <FormLabel> Output Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="output name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.dataType"
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
                      <UiSelectItem value="STRING"> STRING </UiSelectItem>
                      <UiSelectItem value="INT"> INT </UiSelectItem>
                      <UiSelectItem value="LONG"> LONG </UiSelectItem>
                      <UiSelectItem value="DOUBLE"> DOUBLE </UiSelectItem>
                      <UiSelectItem value="BOOLEAN"> BOOLEAN </UiSelectItem>
                      <UiSelectItem value="DATETIME"> DATETIME </UiSelectItem>
                      <UiSelectItem value="COLLECTION">
                        COLLECTION
                      </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.responseScope"
              v-slot="{ componentField }"
              name="responseScope"
            >
              <FormItem>
                <FormLabel> Response Scope </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a response scope" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="RESPONSE"> RESPONSE </UiSelectItem>
                      <UiSelectItem value="HEADER"> HEADER </UiSelectItem>
                      <UiSelectItem value="ERROR"> ERROR </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.responseValuePath"
              v-slot="{ componentField }"
              name="responseValuePath"
            >
              <FormItem>
                <FormLabel> Response Value Path </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="response value path"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.transferCoreMapping"
              v-slot="{ componentField }"
              name="transferCoreMapping"
            >
              <FormItem>
                <FormLabel> Transfer Core Mapping </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select a transfer core mapping"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="AMOUNT"> AMOUNT </UiSelectItem>
                      <UiSelectItem value="CREDIT_ACCOUNT">
                        CREDIT_ACCOUNT
                      </UiSelectItem>
                      <UiSelectItem value="REASON"> REASON </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.constantValueToCompare"
              v-slot="{ componentField }"
              name="constantValueToCompare"
            >
              <FormItem>
                <FormLabel> Constant Value To Compare </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="constant value to compare"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.operatorToCompareValue"
              v-slot="{ componentField }"
              name="operatorToCompareValue"
            >
              <FormItem>
                <FormLabel> Operator To Compare Value </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue
                        placeholder="Select an operator to compare value"
                      />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="EQUAL_TO"> EQUAL_TO </UiSelectItem>
                      <UiSelectItem value="NOT_EQUAL_TO">
                        NOT_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="OBJECT_"> OBJECT_ </UiSelectItem>
                      <UiSelectItem value="OBJECT_NOT_EQUAL_TO">
                        OBJECT_NOT_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="GREATER_THAN">
                        GREATER_THAN
                      </UiSelectItem>
                      <UiSelectItem value="LESS_THAN"> LESS_THAN </UiSelectItem>
                      <UiSelectItem value="GREATER_THAN_OR_EQUAL_TO">
                        GREATER_THAN_OR_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="LESS_THAN_OR_EQUAL_TO">
                        LESS_THAN_OR_EQUAL_TO
                      </UiSelectItem>
                      <UiSelectItem value="NONE"> NONE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.isRequired"
              v-slot="{ componentField }"
              name="isRequired"
            >
              <FormItem>
                <FormLabel> Is Required </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="item.isRequired"
                    @update:checked="item.isRequired = !item.isRequired"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.isLogicField"
              v-slot="{ componentField }"
              name="isLogicField"
            >
              <FormItem>
                <FormLabel> Is Logic Field </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="item.isLogicField"
                    @update:checked="item.isLogicField = !item.isLogicField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="item.isVisibleForUser"
              v-slot="{ componentField }"
              name="isVisibleForUser"
            >
              <FormItem>
                <FormLabel> Is Visible For User </FormLabel>
                <FormControl>
                  <UiSwitch
                    :checked="item.isVisibleForUser"
                    @update:checked="
                      item.isVisibleForUser = !item.isVisibleForUser
                    "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div
            class="col-span-full w-full flex justify-end gap-4 pt-4 border-t"
          >
            <UiSheet>
              <UiSheetTrigger>
                <UiButton variant="outline" type="button" size="sm">
                  Manage Validation Rules
                </UiButton>
              </UiSheetTrigger>
              <UiSheetContent
                class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
              >
                <OperationsResponseOutputsValidationRules
                  :responseOutput="item"
                />
              </UiSheetContent>
            </UiSheet>
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
                  <UiAlertDialogAction
                    @click="deleteResponseOutputHandler(item.id)"
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
      v-if="responseOutputs.length === 0 && !newParameter"
    >
      No response outputs
    </div>
  </UiAccordion>
</template>
