<script lang="ts" setup>
import { watch } from "vue"; // Import watch from Vue
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { useIntegrations } from "~/composables/useIntegrations";
import { apiIntegrationFormSchema } from "~/validations/apiIntegrationFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { IntegrationType, Protocol, RetryStrategy } from "@/global-types";
import AuthConfig from "~/components/operations/AuthConfig.vue";

const route = useRoute();
const { getIntegrationById, updateIntegration, isSubmitting, isLoading } =
  useIntegrations();
const { getAuthConfigs } = useAuthConfigs();
const openItems = ref("serviceDefinition");
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const integrationId = ref<string>("");
const loading = ref(false);
const isError = ref(false);
const data = ref<ApiIntegration>();
const allAuthConfigs = ref<AuthConfig[]>();
pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
integrationId.value = route.params.id;
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "serviceDefinition";

const operationName = ref<string>("Configure Operations");

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);

const form = useForm<ApiIntegration>({
  validationSchema: apiIntegrationFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    values.authConfig = values.authConfig
      ? {
          ...values.authConfig,
        }
      : null;
    data.value = await updateIntegration(values.id, values); // Call your API function to fetch profile
    form.setValues(data.value);
    openItems.value = "operations";
    toast({
      title: "Integration Updated",
      description: "Integration updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating integration:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const displayApiDataOnLabel = (data: any) => {
  if (data == null || data == "") {
    return "-";
  }
  if (data == false) {
    return "false";
  }
  if (data == true) {
    return "true";
  }
  return data; // Default case if customerActivated is undefined or any other value
};

const getIntegrationData = async () => {
  try {
    loading.value = true;
    data.value = await getIntegrationById(integrationId.value); // Call your API function to fetch roles
    form.setValues(data.value);
  } catch (err) {
    console.error("Error fetching integrations:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const getApiAuthConfigsData = async () => {
  try {
    allAuthConfigs.value = await getAuthConfigs();
  } catch (err) {
    console.error("Error fetching api auth configs:", err);
  }
};

onMounted(async () => {
  getIntegrationData();
  // getApiAuthConfigsData();
});

const refetch = async () => {
  await getIntegrationData();
  // await getApiAuthConfigsData();
};
</script>

<template>
  <div class="flex flex-col gap-3 items-cente text-sm">
    <div
      class="flex flex-col justify-center items-center gap-3 border p-2 bg-background rounded-xl"
    >
      <h1 class="md:text-sm items-center font-bold">
        {{ data?.name }}
      </h1>
    </div>

    <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
      >
        <UiTabsTrigger
          value="serviceDefinition"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'serviceDefinition',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Service Definition
        </UiTabsTrigger>
        <UiTabsTrigger
          value="operations"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'operations',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          Operations
        </UiTabsTrigger>
        <UiTabsTrigger
          value="configureOperations"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'configureOperations',
              },
            })
          "
          :disabled="openItems != 'configureOperations'"
          :class="openItems == 'configureOperations' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          {{ operationName }}
        </UiTabsTrigger>
        <UiTabsTrigger
          value="newOperation"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'newOperation',
              },
            })
          "
          :disabled="openItems != 'newOperation'"
          :class="openItems == 'newOperation' ? '' : 'hidden'"
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
        >
          New Operation
        </UiTabsTrigger>
      </UiTabsList>

      <UiTabsContent
        value="serviceDefinition"
        class="text-base bg-background p-6 rounded-lg"
      >
        <div v-if="loading" class="py-10 flex justify-center w-full">
          <UiLoading />
        </div>
        <div v-else-if="data && !isError">
          <form @submit="onSubmit">
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
                :model-value="data?.name"
                v-slot="{ componentField }"
                name="name"
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
                :model-value="data?.url"
                v-slot="{ componentField }"
                name="url"
              >
                <FormItem>
                  <FormLabel> URL </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter URL"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.apiIntegrationPath"
                v-slot="{ componentField }"
                name="apiIntegrationPath"
              >
                <FormItem>
                  <FormLabel> API Integration Path </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter API Integration Path"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.host"
                v-slot="{ componentField }"
                name="host"
              >
                <FormItem>
                  <FormLabel> Host </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter Host"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.protocol"
                v-slot="{ componentField }"
                name="protocol"
              >
                <FormItem>
                  <FormLabel> Protocol </FormLabel>
                  <UiSelect v-bind="componentField">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue placeholder="Select a protocol" />
                      </UiSelectTrigger>
                    </FormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem
                          v-for="item in Object.values(Protocol)"
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
                :model-value="data?.type"
                v-slot="{ componentField }"
                name="type"
              >
                <FormItem>
                  <FormLabel> Type </FormLabel>
                  <UiSelect v-bind="componentField">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue placeholder="Select a service type" />
                      </UiSelectTrigger>
                    </FormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem
                          v-for="item in Object.values(IntegrationType)"
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
                :model-value="data?.retryStrategy"
                v-slot="{ componentField }"
                name="retryStrategy"
              >
                <FormItem>
                  <FormLabel> Retry Strategy </FormLabel>
                  <UiSelect v-bind="componentField">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue placeholder="Select a retry strategy" />
                      </UiSelectTrigger>
                    </FormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem
                          v-for="item in Object.values(RetryStrategy)"
                          :key="item"
                          :value="item"
                        >
                          {{ item }}
                        </UiSelectItem>
                      </UiSelectGroup>
                    </UiSelectContent>
                  </UiSelect>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.version"
                v-slot="{ componentField }"
                name="version"
              >
                <FormItem>
                  <FormLabel> Version </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      placeholder="Enter version"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.timeout"
                v-slot="{ componentField }"
                name="timeout"
              >
                <FormItem>
                  <FormLabel> Timeout </FormLabel>
                  <FormControl>
                    <UiInput
                      type="number"
                      placeholder="Enter timeout"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.retryRetries"
                v-slot="{ componentField }"
                name="retryRetries"
              >
                <FormItem>
                  <FormLabel> Retry Retries </FormLabel>
                  <FormControl>
                    <UiInput
                      type="number"
                      placeholder="Enter retry retries"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :model-value="data?.retryDelay"
                v-slot="{ componentField }"
                name="retryDelay"
              >
                <FormItem>
                  <FormLabel> Retry Delay </FormLabel>
                  <FormControl>
                    <UiInput
                      type="number"
                      placeholder="Enter retry delay"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- <FormField
                :model-value="data?.authConfig?.id"
                v-slot="{ componentField }"
                name="authConfig"
              >
                <FormItem>
                  <FormLabel> Auth Config </FormLabel>
                  <UiSelect v-bind="componentField">
                    <FormControl>
                      <UiSelectTrigger>
                        <UiSelectValue
                          :placeholder="
                            data?.authConfig?.id
                              ? data?.authConfig?.id
                              : 'Select an auth config'
                          "
                        />
                      </UiSelectTrigger>
                    </FormControl>
                    <UiSelectContent>
                      <UiSelectGroup>
                        <UiSelectItem
                          v-for="item in allAuthConfigs"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{
                            item?.authConfigName || item?.authType || item?.id
                          }}
                        </UiSelectItem>
                      </UiSelectGroup>
                    </UiSelectContent>
                  </UiSelect>
                </FormItem>
              </FormField> -->
              <FormField
                :model-value="data?.description"
                v-slot="{ componentField }"
                name="description"
              >
                <FormItem>
                  <FormLabel> Description </FormLabel>
                  <FormControl>
                    <UiTextarea
                      placeholder="Enter Description"
                      class="resize-y"
                      rows="0"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <UiSheet>
                <div class="flex flex-col gap-2">
                  <UiLabel>Auth Config</UiLabel>
                  <UiSheetTrigger>
                    <UiButton
                      class="w-full"
                      variant="outline"
                      type="button"
                      size="sm"
                    >
                      Auth Config
                    </UiButton>
                  </UiSheetTrigger>
                </div>

                <UiSheetContent
                  class="md:min-w-[600px] sm:min-w-full flex flex-col h-full overflow-y-auto"
                >
                  <AuthConfig :apiIntegrationProps="data" />
                </UiSheetContent>
              </UiSheet>
              <div class="col-span-full w-full py-4 flex justify-between">
                <UiButton
                  :disabled="loading"
                  variant="outline"
                  type="button"
                  size="lg"
                  @click="$router.go(-1)"
                >
                  Cancel
                </UiButton>
                <UiButton :disabled="loading" size="lg" type="submit">
                  <Icon
                    name="svg-spinners:8-dots-rotate"
                    v-if="loading"
                    class="mr-2 h-4 w-4 animate-spin"
                  ></Icon>

                  Update
                </UiButton>
              </div>
            </div>
          </form>
        </div>
        <div v-if="isError">
          <ErrorMessage :retry="refetch" title="Something went wrong." />
        </div>
      </UiTabsContent>

      <UiTabsContent
        value="operations"
        class="text-base bg-background p-6 rounded-lg"
      >
        <Operations :apiIntegrationIdProps="integrationId" />
      </UiTabsContent>

      <UiTabsContent
        value="configureOperations"
        class="text-base bg-background py-0 rounded-lg"
      >
        <OperationsConfigurations />
      </UiTabsContent>

      <UiTabsContent
        value="newOperation"
        class="text-base bg-background py-2 rounded-lg"
      >
        <OperationsNewOperation :integrationId="integrationId" />
      </UiTabsContent>
    </UiTabs>
  </div>
</template>

<style lang="css" scoped></style>
