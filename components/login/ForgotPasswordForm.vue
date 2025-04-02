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
import { forgotPasswordFormSchema } from "~/validations/forgotPasswordFormSchema";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

const store = useAuthStore();
const { login, isLoading } = useAuth();
const router = useRouter();
let showPassword = ref(false);
let showConfirmPassword = ref(false);

const { toast } = useToast();

const form = useForm({
  validationSchema: forgotPasswordFormSchema,
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  const userCredentials = {
    email: values.email,
    password: values.newPassword,
  };
console.log("userCredentials: ",userCredentials)
  try {
    // const data = await login(userCredentials);
    // If login is successful, navigate to the home page
    navigateTo("/login", { replace: true });
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
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="email"
                v-bind="componentField"
                :disabled="isLoading"
                aria-autocomplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="newPassword">
          <FormItem>
            <FormLabel>New Password</FormLabel>
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
        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <div
                className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
              >
                <UiInput
                  :type="[showConfirmPassword ? 'text' : 'password']"
                  placeholder="******"
                  v-bind="componentField"
                  :disabled="isLoading"
                  aria-autocomplete="password"
                />

                <Icon
                  v-if="showPassword"
                  name="material-symbols:visibility-off-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="toggleConfirmPasswordVisibility"
                ></Icon>
                <Icon
                  v-else
                  name="material-symbols:visibility-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="toggleConfirmPasswordVisibility"
                ></Icon>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex justify-end items-center pb-3">
          <NuxtLink
            to="/login"
            class="text-primary text-right text-sm font-medium"
          >
            SignIn
          </NuxtLink>
        </div>
        <UiButton :disabled="isLoading">
          <Icon
            v-if="isLoading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>

          Reset Password
        </UiButton>
      </div>
    </form>
  </div>
</template>
