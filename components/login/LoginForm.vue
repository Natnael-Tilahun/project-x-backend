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
import { customerLoginFormSchema } from "~/validations/customerLoginFormSchema";
const store = useAuthStore();

const isLoading = ref(false);

const form = useForm({
  validationSchema: customerLoginFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;

  const { body }: any = await $fetch("/api/login", {
    method: "post",
    body: values,
  }).catch((err) => {
    console.log(err);
    isLoading.value = false;
  });
  store.email = body.email;
  // setTimeout(() => {
  isLoading.value = false;
  navigateTo("/");
  // }, 3000);
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
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

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
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

        <div class="grid pb-3">
          <NuxtLink
            to="/forgotPassword"
            class="text-primary text-right text-sm"
          >
            Forgot Password?
          </NuxtLink>
        </div>
        <UiButton :disabled="isLoading">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
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
