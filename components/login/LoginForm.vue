<script setup lang="ts">
import { ref, computed } from "vue";
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
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const store = useAuthStore();
const { login, isLoading } = useAuth();
const router = useRouter();
let showPassword = ref(false);
const { toast } = useToast();

const form = useForm({
  validationSchema: userLoginFormSchema,
});

const maskedUsername = computed(() => {
  const username = form.values.username;
  if (!username) return '';
  if (username.length <= 3) return username;
  return username.slice(0, 3) + '*'.repeat(username.length - 3);
});

store.username && form.setFieldValue("username", store.username.slice(0, 3) + '*'.repeat(store.username.length - 3)) 

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
            <FormLabel>Username or Email</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="username"
                v-bind="componentField"
                :disabled="isLoading"
                aria-autocomplete="username"
                :value="maskedUsername"
                @input="(e:any) => form.setFieldValue('username', e.target.value)"
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
                  :type="['password']"
                  placeholder="******"
                  v-bind="componentField"
                  :disabled="isLoading"
                  aria-autocomplete="password"
                />
                <!-- 
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
                ></Icon> -->
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end items-center pb-3">
          <!-- <FormField
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
          </FormField> -->
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
  </div>
</template>
