<script setup lang="ts">
import { ref } from "vue";
// import LucideSpinner from "~icons/lucide/loader-2";
// import GitHubLogo from "~icons/radix-icons/github-logo";

import { cn } from "@/lib/utils";

const isLoading = ref(false);
async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    navigateTo("/");
  }, 3000);
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <UiLabel class="sr-only" for="email"> Email </UiLabel>
          <UiInput
            id="email"
            placeholder="name@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <UiLabel class="sr-only" for="password"> Password </UiLabel>
          <UiInput
            id="password"
            placeholder="******"
            type="text"
            auto-capitalize="none"
            auto-complete=""
            auto-correct="off"
            :disabled="isLoading"
          />
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
