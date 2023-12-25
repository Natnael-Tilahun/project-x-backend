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

const isLoading = ref(false);

const form = useForm({
  validationSchema: forgotPasswordFormSchema,
});

const onSubmit = form.handleSubmit((values: any) => {
  console.log("Form submitted!", values);
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    navigateTo("/login");
  }, 3000);
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel> Username or Email</FormLabel>
            <FormControl>
              <UiInput
                type="email"
                placeholder="name@example.com"
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="newPassword">
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="******"
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Re-enter New Password</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="******"
                v-bind="componentField"
                :disabled="isLoading"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <UiButton :disabled="isLoading" class="uppercase">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>

          Reset Password
        </UiButton>
      </div>
    </form>
  </div>
</template>
