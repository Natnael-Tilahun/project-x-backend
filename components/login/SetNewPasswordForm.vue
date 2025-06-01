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
import { newUserPasswordFormSchema } from "~/validations/newUserPasswordFormSchema";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuth } from "~/composables/useAuth";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "nuxt/app";

const store = useAuthStore();
const { setNewPassword, isLoading } = useAuth();
const route = useRoute();
let showPassword = ref(false);
let showConfirmPassword = ref(false);

const { toast } = useToast();

const form = useForm({
  validationSchema: newUserPasswordFormSchema,
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
    key: route.query.key,
    newPassword: values.newPassword,
  };
  console.log("userCredentials: ", userCredentials);
  try {
    const data = await setNewPassword(userCredentials);
    // Get the current base URL from the runtime config
    const runtimeConfig = useRuntimeConfig();
    const homeUrl = runtimeConfig.public.HOME_URL;
    // Extract the domain from the API base URL    // Construct the login URL with the current domain
    const loginUrl = `${homeUrl}/login`;
    navigateTo(loginUrl, { replace: true, external: true });
    toast({
      title: "Password updated successfully",
      description: "You can now login with your new password",
    });
  } catch (error) {
    console.error("Login error: ", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
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

        <UiButton :disabled="isLoading" class="mt-4">
          <Icon
            v-if="isLoading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>

          Set New Password
        </UiButton>
      </div>
    </form>
  </div>
</template>
