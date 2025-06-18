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
import type { ResponseOutput } from "~/types";

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

const emit = defineEmits(["update:operation"]);

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

    emit("update:operation");

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
      apiOperationId: operationId.value
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
    emit("update:operation");

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

const newParameter = ref<ResponseOutput| null>(null);

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

const handleValidationRulesUpdate = (updatedOutput: ResponseOutput) => {
  const index = responseOutputs.value.findIndex(
    (item) => item.id === updatedOutput.id
  );
  if (index !== -1) {
    responseOutputs.value[index] = updatedOutput;
    emit("update:operation");
  }
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
  <UiAccordion
    type="single"
    class="w-full"
    collapsible
    defaultValue="newParameter"
  >
    <!-- New Parameter Form -->
    <UiAccordionItem
      class="my-2 border-b-0 space-y-2 text-sm"
      v-if="newParameter"
      value="newParameter"
    >
      <UiAccordionTrigger
        class="text-sm font-semibold border px-4 py-4 rounded-lg"
      >
        New Parameter
      </UiAccordionTrigger>
      <UiAccordionContent class="pt-4 px-4 bg-muted rounded-lg">
        <form @submit="onSubmitNewParameter">
          <div
            class="grid xl:grid-cols-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2 text-sm"
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

    <!-- Tabs for categorizing parameters -->
    <UiTabs defaultValue="response" class="w-full">
      <UiTabsList class="w-full flex justify-start py-0 gap-2 border-b">
        <UiTabsTrigger
          v-for="scope in ['RESPONSE', 'HEADER', 'ERROR', 'NONE']"
          :key="scope"
          :value="scope.toLowerCase()"
          class="text-sm font-medium"
        >
          {{ scope }}
          <span class="ml-2 text-xs text-muted-foreground">
            ({{
              responseOutputs.filter((output) => output.responseScope === scope)
                .length
            }})
          </span>
        </UiTabsTrigger>
        <div class="w-full flex justify-end">
          <UiButton
            :disabled="loading"
            size="sm"
            type="button"
            variant="outline"
            class="border-primary text-primary"
            @click="addNewParameter"
          >
            <Icon name="material-symbols:add-2" class="mr-2 h-4 w-4"></Icon>
            Add Parameter
          </UiButton>
        </div>
      </UiTabsList>

      <!-- Tab content for each response scope -->
      <UiTabsContent
        v-for="scope in ['RESPONSE', 'HEADER', 'ERROR', 'NONE']"
        :key="scope"
        :value="scope.toLowerCase()"
      >
        <UiAccordion type="single" collapsible>
          <UiAccordionItem
            v-for="item in responseOutputs.filter(
              (output) => output.responseScope === scope
            )"
            :key="item.id"
            :value="item.id"
            class="my-2 border rounded-lg"
          >
            <UiAccordionTrigger class="px-4 py-3">
              <div class="flex items-center justify-between w-full">
                <span class="font-medium text-sm">{{ item.outputName }}</span>
                <span class="text-xs text-muted-foreground">
                  {{ item.dataType }}
                </span>
              </div>
            </UiAccordionTrigger>
            <UiAccordionContent class="p-4 bg-muted/50">
              <form @submit="onSubmit">
                <div
                  class="grid xl:grid-cols-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-2 text-sm"
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
                            <UiSelectItem value="BOOLEAN">
                              BOOLEAN
                            </UiSelectItem>
                            <UiSelectItem value="DATETIME">
                              DATETIME
                            </UiSelectItem>
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
                            <UiSelectValue
                              placeholder="Select a response scope"
                            />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem value="RESPONSE">
                              RESPONSE
                            </UiSelectItem>
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
                        @update:responseOutput="handleValidationRulesUpdate"
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
                          This action cannot be undone. This will permanently
                          delete the request input and remove your data from our
                          servers.
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
        </UiAccordion>

        <!-- Empty state for each tab -->
        <div
          v-if="
            !responseOutputs.filter((output) => output.responseScope === scope)
              .length
          "
          class="flex flex-col items-center justify-center py-8 text-muted-foreground"
        >
          <p>No {{ scope.toLowerCase() }} parameters</p>
          <UiButton
            variant="outline"
            size="sm"
            class="mt-2"
            @click="addNewParameter"
            type="button"
          >
            Add New {{ scope.toLowerCase() }} parameter
          </UiButton>
        </div>
      </UiTabsContent>
    </UiTabs>
  </UiAccordion>
</template>
