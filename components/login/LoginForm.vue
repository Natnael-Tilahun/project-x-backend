<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userLoginFormSchema } from "~/validations/userLoginFormSchema";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";
const store = useAuthStore();
const { login, isLoading } = await useAuth();
let showPassword = ref(false);
const { toast } = useToast();

// const isLoading = ref(false);

const form = useForm({
  validationSchema: userLoginFormSchema,
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  const userCredentials = {
    username: values.username,
    password: values.password,
    rememberMe: values.rememberMe,
  };

  try {
    const data = await login(userCredentials);
    console.log("data: ", data);
    // If login is successful, navigate to the home page
    navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Login error: ", error);
  } finally {
    // Ensure to stop loading state whether login is successful or not
    isLoading.value = false;
  }
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel> Username or Email</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="username"
                v-bind="componentField"
                :disabled="isLoading"
                aria-autocomplete="username"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div
                className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
              >
                <UiInput
                  :type="[showPassword ? 'text' : 'password']"
                  placeholder="******"
                  v-bind="componentField"
                  :disabled="isLoading"
                  aria-autocomplete="password"
                />

                <Icon
                  v-if="showPassword"
                  name="material-symbols:visibility-off-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="togglePasswordVisibility"
                ></Icon>
                <Icon
                  v-else
                  name="material-symbols:visibility-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="togglePasswordVisibility"
                ></Icon>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-between items-center pb-3">
          <FormField
            v-slot="{ value, handleChange }"
            type="checkbox"
            name="rememberMe"
          >
            <FormItem
              class="flex flex-row w-fit items-start gap-x-3 space-y-0 py-4"
            >
              <FormControl>
                <UiCheckbox :checked="value" @update:checked="handleChange" />
              </FormControl>
              <div class="space-y-1 leading-none">
                <FormLabel>Remember Me</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>
          <NuxtLink
            to="/forgotPassword"
            class="text-primary text-right text-sm"
          >
            Forgot Password?
          </NuxtLink>
        </div>
        <UiButton :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>

          Sign In with Email
        </UiButton>
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <UiButton variant="outline" type="button" :disabled="isLoading">
      <Icon
        name="svg-spinners:8-dots-rotate"
        v-if="isLoading"
        class="mr-2 h-4 w-4 animate-spin"
      ></Icon>
      <Icon name="mdi:github" v-else class="mr-2 h-4 w-4"></Icon>
      GitHub
    </UiButton>
    <UiButton variant="outline" type="button" :disabled="isLoading">
      <Icon
        name="svg-spinners:8-dots-rotate"
        v-if="isLoading"
        class="mr-2 h-4 w-4 animate-spin"
      ></Icon>
      <Icon name="mdi:google" v-else class="mr-2 h-4 w-4"></Icon>
      Google
    </UiButton>
  </div>
</template>
