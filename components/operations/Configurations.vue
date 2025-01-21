<script lang="ts" setup>
const openItems = ref("configuration");
import { useForm } from "vee-validate";
import { ref, watch, onMounted, computed } from "vue";
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
import { HttpMethod, BodyType } from "@/global-types";
import { parseStringPromise } from "xml2js";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const route = useRoute();
const { getOperationById, updateOperation, testOperation } = useOperations();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<ApiOperation>();
const tooltipText = ref<string>("Copy to clipboard");
const tooltipOpen = ref<boolean>(true);
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id;
const activeTab = route.query.activeTab as string;
const operationId = (route.query.operationId as string) || "";
const isPreview = ref<boolean>(false);
const isShowResponse = ref<boolean>(false);
const testResponse = ref<any>(null);
const isTestError = ref<boolean>(false);

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

const fetchData = async () => {
  isError.value = false;
  try {
    loading.value = true;
    data.value = await getOperationById(operationId);
    form.setValues(data.value);
  } catch (err) {
    console.error("Error fetching operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const handleOperationUpdate = async () => {
  await fetchData();
};

onMounted(() => {
  fetchData();
});

const refetch = async () => {
  await fetchData();
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

function isJSON(data) {
  try {
    JSON.parse(data); // Attempt to parse the data
    return true; // It's valid JSON
  } catch (error) {
    return false; // Parsing failed, not JSON
  }
}

const formattedContent = ref(null);
const isLoading = ref(false);

async function updateFormattedContent() {
  if (data.value?.requestBodyTemplate) {
    isLoading.value = true;
    try {
      formattedContent.value = await formatContent(
        data.value.requestBodyTemplate
      );
    } catch (error) {
      console.error("Error formatting content:", error);
      formattedContent.value = data.value.requestBodyTemplate;
    } finally {
      isLoading.value = false;
    }
  }
}

watch(
  () => data.value?.requestBodyTemplate,
  async () => {
    await updateFormattedContent();
  }
);

onMounted(async () => {
  await updateFormattedContent();
});

async function formatContent(content) {
  if (!content) return "";

  if (isJSON(content)) {
    return JSON.parse(content);
  } else {
    try {
      const result = await parseStringPromise(content, {
        explicitArray: false,
      });
      return result;
    } catch (err) {
      console.log("Invalid XML");
      return content;
    }
  }
}

const parsedResponse = computed(() => {
  if (!testResponse.value?.operationResponse) return null;
  try {
    if (isJSON(testResponse.value.operationResponse)) {
      return JSON.parse(testResponse.value.operationResponse);
    } else {
      return testResponse.value.operationResponse;
    }
  } catch (err) {
    console.error("Error parsing response:", err);
    return testResponse.value.operationResponse;
  }
});

const testingOperation = async () => {
  try {
    loading.value = true;
    const response = await testOperation(operationId);
    testResponse.value = response;
    isShowResponse.value = true;
    toast({
      title: "Operation Tested",
      description: "Operation tested successfully",
    });
  } catch (err: any) {
    console.error("Error testing operation:", err);
    isTestError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col gap-6 items-cente pb-6"
    id="app"
    vaul-drawer-wrapper
  >
    <form @submit="onSubmit">
      <div class="grid grid-cols-2 gap-4 px-6 py-4 text-sm border-b">
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
            <FormLabel> HTTP Method</FormLabel>
            <UiSelect v-bind="componentField">
              <FormControl>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a service type" />
                </UiSelectTrigger>
              </FormControl>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem
                    v-for="item in Object.values(HttpMethod)"
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
          :model-value="data?.bodyType"
          v-slot="{ componentField }"
          name="bodyType"
        >
          <FormItem>
            <FormLabel> Body Type</FormLabel>
            <UiSelect v-bind="componentField">
              <FormControl>
                <UiSelectTrigger>
                  <UiSelectValue placeholder="Select a body type" />
                </UiSelectTrigger>
              </FormControl>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem
                    v-for="item in Object.values(BodyType)"
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
        <FormField
          :model-value="data?.apiOperationPath"
          v-slot="{ componentField }"
          name="apiOperationPath"
        >
          <FormItem>
            <FormLabel> Api Operation Path </FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="Enter api operation path"
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
                  <span v-if="isPreview" class="text-xs text-muted-foreground"
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
              <FormControl v-if="!isPreview" class="h-fit">
                <UiTextarea
                  placeholder="Enter request body template"
                  class="resize-y"
                  rows="8"
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
            <pre class="bg-gray-100 rounded overflow-x-auto text-sm">
                  <div v-if="isLoading">Loading...</div>
                  <div v-else>{{ formattedContent }}</div>
                </pre>
          </div>
        </div>
        <div class="col-span-full w-full py-4 flex justify-end gap-4">
          <UiButton
            type="button"
            :disabled="loading"
            size="sm"
            variant="outline"
            @click="testingOperation"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            ></Icon>
            Test
          </UiButton>
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
      <UiTabs defaultValue="requestInputs" class="w-full">
        <UiTabsList
          class="w-full flex bg-slate- overflow-x-scroll justify-start px-6 py-0 pt-2 h-fit gap-2 border-b rounded-b-none border-primary bg-background"
        >
          <UiTabsTrigger
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="requestInputs"
            >Request Inputs</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg font-normal data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-0 data-[state=inactive]:border rounded-t-lg rounded-b-none data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted"
            value="responseOutputs"
            >Response Outputs</UiTabsTrigger
          >
          <div class="flex items-center gap-2 ml-auto">
            <UiLabel>Show Test Response</UiLabel>
            <UiSwitch
              :checked="isShowResponse"
              @update:checked="isShowResponse = !isShowResponse"
            ></UiSwitch>
          </div>
        </UiTabsList>

        <UiTabsContent
          class="text-base h-full px-6 py-2 space-y-2"
          value="requestInputs"
        >
          <OperationsRequestInputs
            :requestInputs="data?.requestInputs"
            :operationIdProps="operationId"
            @update:operation="handleOperationUpdate"
          />
        </UiTabsContent>

        <UiTabsContent
          class="text-base h-full px-6 py-2 space-y-2"
          value="responseOutputs"
        >
          <OperationsResponseOutputs
            :responseOutputs="data?.responseOutputs"
            :operationIdProps="operationId"
            @update:operation="handleOperationUpdate"
          />
        </UiTabsContent>
        <Drawer :open="isShowResponse">
          <DrawerContent class="p-4">
            <div class="flex items-center justify-between gap-2">
              <h1 class="text-lg font-bold">Api Operation Test Response</h1>
              <UiButton
                variant="outline"
                size="sm"
                @click="isShowResponse = false"
                >Cancel</UiButton
              >
            </div>
            <div v-if="isTestError">
              <UiErrorMessage
                :retry="testingOperation"
                title="Something went wrong."
              />
            </div>
            <ResizablePanelGroup
              v-else
              class="min-h-[450px] w-full rounded-lg border mt-2 relative"
              direction="horizontal"
            >
              <ResizablePanel :default-size="25">
                <div
                  class="h-full w-full flex flex-col gap-2 p-2 overflow-y-auto"
                >
                  <h1 class="text-base font-semibold">Operation Request</h1>
                  <div>
                    <p>
                      {{ testResponse?.operationRequest }}
                    </p>
                  </div>
                  <UiSeparator />
                </div>
              </ResizablePanel>
              <ResizableHandle with-handle />
              <ResizablePanel :default-size="25">
                <div
                  class="h-full w-full flex flex-col gap-2 p-2 overflow-y-auto"
                >
                  <h1 class="text-base font-semibold">Operation Response</h1>
                  <div class="h-full w-full">
                    <pre
                      class="bg-gray-100 rounded overflow-x-auto h-full text-sm p-2"
                    >
                      <div>{{ parsedResponse }}</div>
                    </pre>
                  </div>
                  <UiSeparator />
                </div>
              </ResizablePanel>
              <ResizableHandle with-handle />
              <ResizablePanel :default-size="25">
                <div
                  class="h-full w-full flex flex-col gap-2 p-2 overflow-y-auto"
                >
                  <h1 class="text-base font-semibold">Raw Request</h1>
                  <UiSeparator />
                </div>
              </ResizablePanel>
              <ResizableHandle with-handle />
              <ResizablePanel :default-size="25">
                <div
                  class="h-full w-full flex flex-col gap-2 p-2 overflow-y-auto"
                >
                  <h1 class="text-base font-semibold">Raw Response</h1>
                  <UiSeparator />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </DrawerContent>
        </Drawer>
      </UiTabs>
    </form>
    <!-- <div class="col-span-full w-full py-4 flex justify-end gap-4 px-6 border">
      <UiButton
        :disabled="loading"
        size="sm"
        variant="outline"
        type="button"
        @click="$router.go(-1)"
        >Cancel</UiButton
      >
      <UiButton
        type="button"
        :disabled="loading"
        size="sm"
        @click="testingOperation"
      >
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="loading"
          class="mr-2 h-4 w-4 animate-spin"
        ></Icon>
        Test
      </UiButton>
    </div> -->
  </div>
</template>
