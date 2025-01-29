<script lang="ts" setup>
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
import { BodyType, HttpMethod } from "@/global-types";
const openItems = ref("info");
const route = useRoute();
const router = useRouter();
const { getOperationById, updateOperation, createNewOperation, isLoading } =
  useOperations();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(isLoading.value);
const isError = ref(false);
const data = ref<ApiOperation>();
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id;
const activeTab = route.query.activeTab as string;
const operationId = ref<string>("");
const isPreview = ref<boolean>(false);

const props = defineProps<{
  integrationId: string;
}>();

if (props.integrationId) {
  integrationId.value = props.integrationId;
}

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);

const form = useForm<ApiOperation>({
  validationSchema: apiOperationFormSchema,
});

console.log("Integration ID: ", integrationId.value);

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    const operationData = {
      ...values,
      apiIntegration: {
        id: integrationId.value,
      },
    };
    console.log("Operation Data: ", operationData);
    data.value = await createNewOperation(operationData); // Call your API function to fetch profile
    form.setValues(data.value);
    operationId.value = data.value.id;
    router.push(
      `${route.path}?activeTab=configureOperations&operationId=${data.value.id}`
    );
    openItems.value = "requestInputs";
    toast({
      title: "Operation Created",
      description: "Operation created successfully",
    });
  } catch (err: any) {
    console.error("Error creating operation:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}
</script>

<template>
  <div class="flex flex-col gap-6 items-cente">
    <form @submit="onSubmit">
      <UiTabs v-model="openItems" defaultValue="info" class="w-full">
        <!-- <UiTabsContent class="p-6" value="info"> -->
        <div class="grid grid-cols-2 gap-6 p-6">
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
                <FormControl v-if="!isPreview" class="">
                  <UiTextarea
                    placeholder="Enter request body template"
                    class="resize-y"
                    rows="10"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- New code block display for Request Body Template -->
            <div
              v-if="isPreview"
              class="col-span-full mt-4 rounded-lg bg-gray-100 p-6 h-fit min-h-[120px] relative border"
            >
              <Icon
                name="material-symbols:content-copy"
                class="h-6 w-6 absolute top-4 right-4 cursor-pointer"
              ></Icon>
              <pre
                class="h-fit leading-9"
              ><code>{{ data?.requestBodyTemplate }}</code></pre>
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

              Save
            </UiButton>
          </div>
        </div>
        <!-- </UiTabsContent> -->
        <!-- <UiTabsList
          class="w-full flex justify-start px-0 pb-0 h-fit gap-2 border-b rounded-none border-primary bg-transparent"
        >
          <UiTabsTrigger
            class="text-lg w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="info"
            >Info</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="requestInputs"
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            >Request Inputs</UiTabsTrigger
          >
          <UiTabsTrigger
            class="text-lg w-fit min-w-[150px] data-[state=active]:border data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=inactive]:border rounded-t-2xl data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            value="responseOutputs"
            :disabled="
              operationId == '' ||
              operationId == null ||
              operationId == undefined
            "
            >Response Outputs</UiTabsTrigger
          >
        </UiTabsList>
        <UiTabsContent
          class="text-base h-full p-6 space-y-4"
          value="requestInputs"
        >
          <OperationsRequestInputs
            :requestInputs="[]"
            :operationIdProps="operationId"
          />
        </UiTabsContent>
        <UiTabsContent
          class="text-base h-full p-6 space-y-4"
          value="responseOutputs"
        >
          <OperationsResponseOutputs
            :responseOutputs="[]"
            :operationIdProps="operationId"
          />
        </UiTabsContent> -->
      </UiTabs>
    </form>
  </div>
</template>
