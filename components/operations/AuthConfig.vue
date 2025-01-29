<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toast } from "~/components/ui/toast";
import { authConfigFormSchema } from "~/validations/authConfigFormSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "~/components/errorMessage/ErrorMessage.vue";
import { AuthType } from "@/global-types";

const route = useRoute();
const { getAuthConfigById, isLoading } = useAuthConfigs();
const { updateIntegration } = useIntegrations();
const { getOperations } = useOperations();

const authConfigId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(false);
const apiIntegration = ref<ApiIntegration>();
const allApiOperations = ref<ApiOperation[]>([]);
let showPassword = ref(false);
let showClientSecret = ref(false);
let showApiKey = ref(false);
const isError = ref(false);
const apiIntegrationProps = defineProps<{
  apiIntegrationProps: ApiIntegration;
}>();
apiIntegration.value = apiIntegrationProps.apiIntegrationProps;
const data = ref<AuthConfiguration>(apiIntegration.value.authConfig);

const form = useForm({
  validationSchema: authConfigFormSchema,
});

if (data.value) {
  form.setValues(data.value);
}

const getAuthConfigDetails = async () => {
  try {
    isLoading.value = true;
    loading.value = true;
    data.value = await getAuthConfigById(authConfigId.value);
    form.setValues(data.value);
  } catch (err) {
    console.error("Error fetching auth configuration:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
};

const getApiOperationsData = async () => {
  try {
    allApiOperations.value = await getOperations();
  } catch (err) {
    console.error("Error fetching operations:", err);
  }
};

await useAsyncData("paymentIntegrations", () => {
  getApiOperationsData();
});

const refetch = async () => {
  await getApiOperationsData();
};

// Add emits definition
const emit = defineEmits(["refresh"]);

const onSubmit = form.handleSubmit(async (values: any) => {
  console.log("values: ", values);
  try {
    submitting.value = true;
    isError.value = false;
    const updatedValues = {
      ...apiIntegration.value,
      authConfig: {
        ...values,
        ...(values.customAuthOperation
          ? { customAuthOperation: { id: values.customAuthOperation } }
          : null),
      },
    };
    const updatedApiIntegration = await updateIntegration(
      apiIntegration.value.id,
      updatedValues
    );
    form.setValues(updatedApiIntegration.authConfig);

    //   data.value = await updateAuthConfig(values.id, updatedValues); // Call your API function to fetch profile
    //   navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Auth Config Updated",
      description: "Auth Config updated successfully",
    });

    // Emit refresh event after successful update
    emit("refresh");
  } catch (err: any) {
    console.error("Error updating auth config:", err);
    isError.value = true;
  } finally {
    submitting.value = false;
    isError.value = false;
  }
});
</script>

<template>
  <UiSheet>
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2">Auth Config</UiSheetTitle>
      <UiSheetDescription class="py-4 space-y-4">
        <div class="flex flex-col gap-6 items-center">
          <div
            v-if="loading"
            class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
          >
            <UiLoading />
          </div>
          <div v-else-if="isError">
            <ErrorMessage
              :retry="refetch"
              class="w-full"
              title="Something went wrong."
            />
          </div>
          <UiCard v-else class="w-full p-6">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6 w-full">
                <FormField v-slot="{ componentField }" name="id">
                  <FormItem>
                    <FormLabel>Auth Config Id </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        disabled
                        placeholder="Enter auth config Id"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="authConfigName">
                  <FormItem>
                    <FormLabel>Auth Config Name </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter auth config name"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  name="authConfigDescription"
                >
                  <FormItem>
                    <FormLabel>Auth Config Description </FormLabel>
                    <FormControl>
                      <UiInput
                        type="text"
                        placeholder="Enter auth config description"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  :model-value="data?.type"
                  v-slot="{ componentField }"
                  name="authType"
                >
                  <FormItem>
                    <FormLabel> Auth Type </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            :placeholder="
                              data?.authType
                                ? data?.authType
                                : 'Select an auth type'
                            "
                          />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="item in Object.values(AuthType)"
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

                <!-- Basic Auth Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'BASIC'"
                >
                  <h1 class="col-span-full font-bold">Basic Auth</h1>
                  <FormField v-slot="{ componentField }" name="username">
                    <FormItem>
                      <FormLabel> Username </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter username"
                          autocomplete="new-username"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                      <FormLabel> Password </FormLabel>
                      <div
                        className="relative flex items-center bg-input rounded-lg  focus-within:ring-1 focus-within:ring-primary"
                      >
                        <FormControl>
                          <UiInput
                            :type="[showPassword ? 'text' : 'password']"
                            placeholder="Enter password"
                            autocomplete="new-password"
                            v-bind="componentField"
                          />
                          <Icon
                            v-if="showPassword"
                            name="material-symbols:visibility-off-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showPassword = !showPassword"
                          ></Icon>
                          <Icon
                            v-else
                            name="material-symbols:visibility-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showPassword = !showPassword"
                          ></Icon>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- OAuth1 Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'OAUTH1'"
                >
                  <h1 class="col-span-full font-bold">OAUTH1</h1>
                  <FormField v-slot="{ componentField }" name="clientId">
                    <FormItem>
                      <FormLabel> Client Id </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter client id"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="clientSecret">
                    <FormItem>
                      <FormLabel> Client Secret </FormLabel>
                      <div
                        className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
                      >
                        <FormControl>
                          <UiInput
                            :type="[showClientSecret ? 'text' : 'password']"
                            placeholder="Enter client secret"
                            v-bind="componentField"
                          />
                          <Icon
                            v-if="showClientSecret"
                            name="material-symbols:visibility-off-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showClientSecret = !showClientSecret"
                          ></Icon>
                          <Icon
                            v-else
                            name="material-symbols:visibility-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showClientSecret = !showClientSecret"
                          ></Icon>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="tokenUrl">
                    <FormItem>
                      <FormLabel> Token Url </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter token url"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="currentToken">
                    <FormItem>
                      <FormLabel> Current Token </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter current token"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- OAuth2 Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'OAUTH2'"
                >
                  <h1 class="col-span-full font-bold">OAUTH2</h1>
                  <FormField v-slot="{ componentField }" name="clientId">
                    <FormItem>
                      <FormLabel> Client Id </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter client id"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="clientSecret">
                    <FormItem>
                      <FormLabel> Client Secret </FormLabel>
                      <div
                        className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
                      >
                        <FormControl>
                          <UiInput
                            :type="[showClientSecret ? 'text' : 'password']"
                            placeholder="Enter client secret"
                            v-bind="componentField"
                          />
                          <Icon
                            v-if="showClientSecret"
                            name="material-symbols:visibility-off-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showClientSecret = !showClientSecret"
                          ></Icon>
                          <Icon
                            v-else
                            name="material-symbols:visibility-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showClientSecret = !showClientSecret"
                          ></Icon>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="tokenUrl">
                    <FormItem>
                      <FormLabel> Token Url </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter token url"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="redirectUri">
                    <FormItem>
                      <FormLabel> Redirect Uri </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter redirect uri"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="grantType">
                    <FormItem>
                      <FormLabel> Grant Type </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter grant type"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="scope">
                    <FormItem>
                      <FormLabel> Scope </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter scope"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- PKCE -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'PKCE'"
                >
                  <h1 class="col-span-full font-bold">PKCE</h1>
                  <FormField v-slot="{ componentField }" name="codeVerifier">
                    <FormItem>
                      <FormLabel> Code Verifier </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter code verifier"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="codeChallenge">
                    <FormItem>
                      <FormLabel> Code Challenge </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter code challenge"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- API Key Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'API_KEY'"
                >
                  <h1 class="col-span-full font-bold">API_KEY</h1>
                  <FormField v-slot="{ componentField }" name="clientId">
                    <FormItem>
                      <FormLabel> Client Id </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter client id"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="apiKey">
                    <FormItem>
                      <FormLabel> Api Key </FormLabel>
                      <div
                        className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
                      >
                        <FormControl>
                          <UiInput
                            :type="[showApiKey ? 'text' : 'password']"
                            placeholder="Enter api key"
                            autocomplete="new-api-key"
                            v-bind="componentField"
                          />
                          <Icon
                            v-if="showApiKey"
                            name="material-symbols:visibility-off-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showApiKey = !showApiKey"
                          ></Icon>
                          <Icon
                            v-else
                            name="material-symbols:visibility-rounded"
                            class="absolute flex right-0 pr-3 items-center w-8 h-8"
                            @Click="showApiKey = !showApiKey"
                          ></Icon>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- JWT Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'JWT'"
                >
                  <h1 class="col-span-full font-bold">JWT</h1>
                  <FormField v-slot="{ componentField }" name="jwtToken">
                    <FormItem>
                      <FormLabel> Jwt Token </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter jwt token"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="currentToken">
                    <FormItem>
                      <FormLabel> Current Token </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter current token"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- Bearer Token Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'BEARER'"
                >
                  <h1 class="col-span-full font-bold">BEARER</h1>
                  <FormField v-slot="{ componentField }" name="currentToken">
                    <FormItem>
                      <FormLabel> Current Token </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter current token"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <!-- Session Cookie Fields -->
                <div
                  class="w-full border p-4 rounded-lg col-span-full grid grid-cols-2 gap-6"
                  v-if="form.values.authType === 'SESSION_COOKIE'"
                >
                  <h1 class="col-span-full font-bold">SESSION_COOKIE</h1>
                  <FormField v-slot="{ componentField }" name="sessionCookie">
                    <FormItem>
                      <FormLabel> Session Cookie </FormLabel>
                      <FormControl>
                        <UiInput
                          type="text"
                          placeholder="Enter session cookie"
                          v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>

                <FormField
                  :model-value="data?.customAuthOperation?.id"
                  v-slot="{ componentField }"
                  name="customAuthOperation"
                >
                  <FormItem>
                    <FormLabel> Custom Auth Operationn </FormLabel>
                    <UiSelect v-bind="componentField">
                      <FormControl>
                        <UiSelectTrigger>
                          <UiSelectValue
                            :placeholder="
                              data?.customAuthOperation
                                ? data?.customAuthOperation
                                : 'Select an custom auth operation'
                            "
                          />
                        </UiSelectTrigger>
                      </FormControl>
                      <UiSelectContent>
                        <UiSelectGroup>
                          <UiSelectItem
                            v-for="item in allApiOperations"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.operationName }}
                          </UiSelectItem>
                        </UiSelectGroup>
                      </UiSelectContent>
                    </UiSelect>
                  </FormItem>
                </FormField>

                <!-- Replace the existing additionalParams FormField with this new implementation -->
                <!-- <FormField
                  v-slot="{ value, handleChange }"
                  name="additionalParams"
                >
                  <FormItem class="col-span-full">
                    <FormLabel>Additional Parameters</FormLabel>
                    <FormControl>
                      <div class="space-y-4">
                        <div class="flex justify-between items-center">
                          <h1 class="text-lg font-semibold">Parameters</h1>
                          <UiButton
                            type="button"
                            variant="outline"
                            size="sm"
                            @click="
                              () => {
                                const params = value || {};
                                const newKey = `param${
                                  Object.keys(params).length + 1
                                }`;
                                handleChange({ ...params, [newKey]: '' });
                              }
                            "
                          >
                            Add Parameter
                          </UiButton>
                        </div>

                        <div
                          v-for="(paramValue, paramKey) in value || {}"
                          :key="paramKey"
                          class="grid grid-cols-2 gap-4 px-4 py-6 border rounded-md relative"
                        >
                          <UiButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="absolute right-1 top-1"
                            @click="
                              () => {
                                const params = { ...value };
                                delete params[paramKey];
                                handleChange(params);
                              }
                            "
                          >
                            <Icon
                              name="lucide:x"
                              class="h-5 text-red-500 border border-red-500 rounded-md w-5"
                            />
                          </UiButton>

                          <FormItem>
                            <FormLabel>Parameter Name</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                :value="paramKey"
                                placeholder="Enter parameter name"
                                @blur="
                                  (e) => {
                                    if (e.target.value !== paramKey) {
                                      const params = { ...value };
                                      const newValue = params[paramKey];
                                      delete params[paramKey];
                                      params[e.target.value] = newValue;
                                      handleChange(params);
                                    }
                                  }
                                "
                              />
                            </FormControl>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Parameter Value</FormLabel>
                            <FormControl>
                              <UiInput
                                type="text"
                                :value="paramValue"
                                placeholder="Enter parameter value"
                                @input="
                                  (e) => {
                                    const params = { ...value };
                                    params[paramKey] = e.target.value;
                                    handleChange(params);
                                  }
                                "
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField> -->

                <div class="col-span-full w-full py-4 flex justify-between">
                  <UiButton
                    :disabled="submitting"
                    variant="outline"
                    type="button"
                    @click="$router.go(-1)"
                  >
                    Cancel
                  </UiButton>
                  <UiButton :disabled="submitting" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="submitting"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>

                    Update
                  </UiButton>
                </div>
              </div>
            </form>
          </UiCard>
        </div>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>
</template>

<style lang="css" scoped></style>
