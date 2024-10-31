<script lang="ts" setup>
const openItems = ref("configuration");
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { useIntegrations } from "~/composables/useIntegrations";
import { apiOperationFormSchema } from "~/validations/apiOperationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const route = useRoute();
const { getOperationById, updateOperation, isSubmitting, isLoading } =
  useOperations();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ApiOperation>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = pathSegments.value[pathLength - 1];
const activeTab = route.query.activeTab as string;
const operationId = route.query.operationId as string;
const isPreview = ref<boolean>(false);

const form = useForm<ApiOperation>({
  validationSchema: apiOperationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    data.value = await updateOperation(operationId, values); // Call your API function to fetch profile
    form.setValues(data.value);
    openItems.value = "operations";
    toast({
      title: "Operation Updated",
      description: "Operation updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const getOperationData = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getOperationById(operationId); // Call your API function to fetch roles
    form.setValues(data.value);
  } catch (err) {
    console.error("Error fetching operations:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

getOperationData();

const refetch = async () => {
  await getOperationData();
};

const copyToClipboard = (data: any) => {
  navigator.clipboard.writeText(data);
  tooltipText.value = "Copied to clipboard";
  tooltipOpen.value = true;
  setTimeout(() => {
    tooltipOpen.value = false;
    tooltipText.value = "Copy to clipboard";
  }, 2000); // Reset the tooltip text after 2 seconds
};
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <form @submit="onSubmit">
      <UiTabs defaultValue="info" class="w-full">
        <UiTabsList
          class="w-full flex overflow-x-scroll justify-start px-6 py-4 h-fit gap-2 border-b rounded-t-lg rounded-b-none border-primary bg-background"
        >
          <UiTabsTrigger
            class="text-lg font-normal w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="info"
            >Info</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="requestInputs"
            >Request Inputs</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="responseOutputs"
            >Response Outputs</UiTabsTrigger
          >
        </UiTabsList>
        <UiTabsContent class="p-6" value="info">
          <div class="grid grid-cols-2 gap-6">
            <FormField
              :model-value="data?.id"
              v-slot="{ componentField }"
              name="id"
            >
              <FormItem>
                <FormLabel> ID </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="CBE050202"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.operationName"
              v-slot="{ componentField }"
              name="operationName"
            >
              <FormItem>
                <FormLabel> Name </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.httpMethod"
              v-slot="{ componentField }"
              name="httpMethod"
            >
              <FormItem>
                <FormLabel> HTTP Method </FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a service type" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup>
                      <UiSelectItem value="GET"> GET </UiSelectItem>
                      <UiSelectItem value="POST"> POST </UiSelectItem>
                      <UiSelectItem value="PUT"> PUT </UiSelectItem>
                      <UiSelectItem value="DELETE"> DELETE </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
              </FormItem>
            </FormField>
            <FormField
              :model-value="data?.endpointPath"
              v-slot="{ componentField }"
              name="endpointPath"
            >
              <FormItem>
                <FormLabel> Endpoint Path </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter endpoint path"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="col-span-full w-full">
              <FormField
                :model-value="data?.requestBodyTemplate"
                v-slot="{ componentField }"
                name="requestBodyTemplate"
              >
                <FormItem>
                  <div class="flex items-center justify-between gap-2">
                    <FormLabel>
                      Request Body Template
                      <span
                        v-if="isPreview"
                        class="text-xs text-muted-foreground"
                        >(Preview)</span
                      >
                    </FormLabel>
                    <div className="flex items-center space-x-2">
                      <UiLabel htmlFor="airplane-mode">Preview</UiLabel>
                      <UiSwitch
                        :checked="isPreview"
                        @update:checked="isPreview = !isPreview"
                      >
                      </UiSwitch>
                    </div>
                  </div>
                  <FormControl v-if="!isPreview" class="">
                    <UiTextarea
                      placeholder="Enter request body template"
                      class="resize-y"
                      rows="15"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <!-- New code block display for Request Body Template -->
              <div
                v-if="isPreview"
                class="col-span-full mt-4 rounded-lg bg-muted p-6 h-fit relative border"
              >
                <Icon
                  name="material-symbols:content-copy"
                  @click="copyToClipboard(data?.requestBodyTemplate)"
                  class="h-6 w-6 absolute top-4 right-4 cursor-pointer text-primary"
                ></Icon>
                <code class="h-fit leading-9">{{
                  data?.requestBodyTemplate
                }}</code>
              </div>
            </div>
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
              <UiButton :disabled="loading" size="sm" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="loading"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Update
              </UiButton>
            </div>
          </div>
        </UiTabsContent>

        <UiTabsContent
          class="text-base h-full p-6 space-y-4"
          value="requestInputs"
        >
          <OperationsRequestInputs :requestInputs="data?.requestInputs" />
        </UiTabsContent>

        <UiTabsContent
          class="text-base h-full p-6 space-y-4"
          value="responseOutputs"
        >
          <OperationsResponseOutputs :responseOutputs="data?.responseOutputs" />
        </UiTabsContent>
      </UiTabs>
    </form>
  </div>
</template>
