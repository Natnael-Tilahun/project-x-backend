<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { authConfigFormSchema } from "~/validations/authConfigFormSchema";
const { getOperations } = useOperations();
const { createNewAuthConfig, isLoading } = useAuthConfigs();
import { AuthType } from "@/global-types";
import type { ApiOperation, AuthConfiguration } from "~/types";

const isError = ref(false);
const data = ref<AuthConfiguration>();
const isSubmitting = ref(false);
const allApiOperations = ref<ApiOperation[]>([]);

const form = useForm({
  validationSchema: authConfigFormSchema,
});

const getApiOperationsData = async () => {
  try {
    allApiOperations.value = await getOperations();
  } catch (err) {
    console.error("Error fetching api operations:", err);
  }
};

onMounted(async () => {
  getApiOperationsData();
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    isLoading.value = true;
    const updatedValues = {
      ...values,
      customAuthOperation: {
        id: values.customAuthOperation,
      },
      additionalParams: {},
    };
    console.log("updatedValues: ", updatedValues);
    data.value = await createNewAuthConfig(updatedValues); // Call your API function to fetch profile
    navigateTo(`/authConfigurations/authConfigDetails/${data.value.id}`);
    toast({
      title: "Auth Config Created",
      description: "Auth Config created successfully",
    });
  } catch (err: any) {
    console.error("Error creating new auth config:", err.message);
    isError.value = true;
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col gap-8">
    <div class="">
      <h1 class="md:text-2xl text-lg font-medium">Create New Auth Config</h1>
      <p class="text-sm text-muted-foreground">
        Create new auth config by including auth config name, auth config
        description, auth type, username, password, client id, client secret,
        token url, redirect uri, code verifier, code challenge, grant type,
        scope, api key, jwt token, current token, session cookie and custom auth
        operation
      </p>
    </div>

    <UiCard class="w-full flex border-[1px] rounded-lg h-full">
      <div value="roleDetails" class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
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
              :model-value="data?.type"
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
      </div>
    </UiCard>
  </div>
</template>
