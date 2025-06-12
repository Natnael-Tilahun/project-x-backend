<script lang="ts" setup>
import { watch } from "vue"; // Import watch from Vue
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { useIntegrations } from "~/composables/useIntegrations";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ApiIntegration, AuthConfiguration } from "~/types";
import { apiIntegrationImportFormSchema } from "~/validations/apiIntegrationImportFormSchema";

const route = useRoute();
const { importIntegration, exportIntegration, isSubmitting, isLoading } =
  useIntegrations();
const { getAuthConfigs } = useAuthConfigs();
const openItems = ref("apiIntegrations");
const loading = ref(false);
const isError = ref(false);
const data = ref<any>();
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "apiIntegrations";

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
  validationSchema: apiIntegrationImportFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    loading.value = true;
    values.authConfig = values.authConfig
      ? {
          ...values.authConfig,
        }
      : null;
    const response = await exportIntegration(values); // Call your API function to fetch profile
    console.log("response: ", response);
    toast({
      title: "Api Integration Exported",
      description: "Api Integration exported successfully",
    });
  } catch (err: any) {
    console.error("Error exporting integration:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-3 items-cente text-sm">
    <div
      class="flex flex-col justify-center items-center gap-3 border p-2 bg-background rounded-xl"
    >
      <h1 class="md:text-sm items-center font-bold">
        Import Export Api and Payment Integrations
      </h1>
    </div>
    <UiPermissionGuard permission="VIEW_API_INTEGRATIONS">
      <UiTabs v-model="openItems" class="w-full space-y-0">
        <UiTabsList
          class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0"
        >
          <UiTabsTrigger
            value="apiIntegrations"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'apiIntegrations',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Api Integrations
          </UiTabsTrigger>
          <UiTabsTrigger
            value="payemntIntegrations"
            @click="
              navigateTo({
                path: route.path,
                query: {
                  activeTab: 'paymentIntegrations',
                },
              })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none"
          >
            Payment Integrations
          </UiTabsTrigger>
        </UiTabsList>

        <UiTabsContent
          value="apiIntegrations"
          class="text-base bg-background p-6 rounded-lg"
        >
          <div class="flex flex-col">
            <UiPermissionGuard permission="UPDATE_API_INTEGRATION">
              <UiButton class="self-end" :disabled="loading" size="lg" type="submit">
                <Icon
                  name="svg-spinners:8-dots-rotate"
                  v-if="loading"
                  class="mr-2 h-4 w-4 animate-spin"
                ></Icon>

                Download Integrations
              </UiButton>
            </UiPermissionGuard>
            <form @submit="onSubmit">
              <div class="flex flex-col justify-between gap-6">
                <FormField
                  :model-value="data?.apiIntegrationFile"
                  v-slot="{ componentField }"
                  name="apiIntegration"
                >
                  <FormItem>
                    <FormLabel>Api Integration Json File</FormLabel>
                    <FormControl>
                      <UiInput
                        type="file"
                        accept=".json"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <UiPermissionGuard permission="UPDATE_API_INTEGRATION">
                  <UiButton :disabled="loading" size="lg" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="loading"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>

                    Export
                  </UiButton>
                </UiPermissionGuard>
              </div>
            </form>
          </div>
        </UiTabsContent>

        <UiTabsContent
          value="payemntIntegrations"
          class="text-base bg-background p-6 rounded-lg"
        >
          pamyment integrations
        </UiTabsContent>
      </UiTabs>
    </UiPermissionGuard>
  </div>
</template>

<style lang="css" scoped></style>
