<script lang="ts" setup>
const openItems = ref(["item-1"]);

import { useForm } from "vee-validate";
import { ref } from "vue";
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
const {
  getAuthConfigById,
  getAuthConfigs,
  updateAuthConfig,
  isLoading,
  isSubmitting,
} = useAuthConfigs();
const { getIntegrations } = useIntegrations();
const { getOperations } = useOperations();

const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
const authConfigId = ref<string>("");
const loading = ref(isLoading.value);
const submitting = ref(isLoading.value);
const allApiIntegrations = ref<ApiIntegration[]>([]);
const allApiOperations = ref<ApiOperation[]>([]);
let showPassword = ref(false);
let showClientSecret = ref(false);
let showApiKey = ref(false);
const isError = ref(false);
const data = ref<AuthConfiguration>();

pathSegments.value = splitPath(fullPath.value);
const pathLength = pathSegments.value.length;
authConfigId.value = pathSegments.value[pathLength - 1];

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

const form = useForm({
  validationSchema: authConfigFormSchema,
});

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
  getAuthConfigDetails();
  getApiOperationsData();
});

const refetch = async () => {
  await getAuthConfigDetails();
  await getApiOperationsData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    submitting.value = true;
    isSubmitting.value = true;
    const updatedValues = {
      ...values,
      ...(values.customAuthOperation
        ? { customAuthOperation: { id: values.customAuthOperation } }
        : null),
    };
    console.log("updatedValues: ", updatedValues);
    data.value = await updateAuthConfig(values.id, updatedValues); // Call your API function to fetch profile
    navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Auth Config Updated",
      description: "Auth Config updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating auth config:", err);
    isError.value = true;
  } finally {
    isSubmitting.value = false;
    submitting.value = false;
  }
});

// const paramKeys = ref<string[]>([]);

// In your getAuthConfigDetails function, after setting form values:
// watch(
//   () => form.values.additionalParams,
//   (newValue) => {
//     if (
//       newValue &&
//       Object.keys(newValue).length > 0 &&
//       paramKeys.value.length === 0
//     ) {
//       paramKeys.value = Object.keys(newValue);
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div
      v-if="loading"
      class="py-10 flex justify-center w-full h-60 md:h-[500px] items-center"
    >
      <UiLoading />
    </div>
    <UiCard v-else-if="data && !isError" class="w-full p-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-2 gap-6">
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
          <FormField v-slot="{ componentField }" name="authConfigDescription">
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
                        data?.authType ? data?.authType : 'Select an auth type'
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
          <FormField
            :model-value="data?.customAuthOperation?.id"
            v-slot="{ componentField }"
            name="customAuthOperation"
          >
            <FormItem>
              <FormLabel> Custom Auth Operation </FormLabel>
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
          <!-- <FormField v-slot="{ value, handleChange }" name="additionalParams">
            <FormItem>
              <FormLabel>Additional Params</FormLabel>
              <FormControl>
                <div class="space-y-2">
                  <div
                    v-for="paramKey in paramKeys"
                    :key="paramKey"
                    class="flex gap-2 mb-2"
                  >
                    <UiInput
                      type="text"
                      placeholder="Parameter Name"
                      :value="paramKey"
                      @input="
                        (e) => {
                          const newValue = { ...value };
                          const oldValue = newValue[paramKey];
                          delete newValue[paramKey];
                          newValue[e.target.value] = oldValue;
                          // Update the key in our order array
                          const keyIndex = paramKeys.indexOf(paramKey);
                          paramKeys[keyIndex] = e.target.value;
                          handleChange(newValue);
                        }
                      "
                    />
                    <UiInput
                      type="text"
                      placeholder="Parameter Value"
                      :value="value?.[paramKey]"
                      @input="
                        (e) =>
                          handleChange({
                            ...value,
                            [paramKey]: e.target.value,
                          })
                      "
                    />
                    <UiButton
                      type="button"
                      variant="destructive"
                      @click="
                        () => {
                          const newValue = { ...value };
                          delete newValue[paramKey];
                          // Remove the key from our order array
                          const keyIndex = paramKeys.indexOf(paramKey);
                          paramKeys.splice(keyIndex, 1);
                          handleChange(newValue);
                        }
                      "
                    >
                      Remove
                    </UiButton>
                  </div>
                  <UiButton
                    type="button"
                    variant=""
                    size="sm"
                    class="mt-2 w-fit"
                    @click="
                      () => {
                        const newKey = `newParam${
                          Object.keys(value || {}).length + 1
                        }`;
                        paramKeys.push(newKey);
                        handleChange({
                          ...value,
                          [newKey]: '',
                        });
                      }
                    "
                  >
                    Add Parameter
                  </UiButton>
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
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound class="w-full" title="Sorry, No auth config found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage
        :retry="refetch"
        class="w-full"
        title="Something went wrong."
      />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
