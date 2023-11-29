<script setup lang="ts">
import { ref } from "vue";

import { cn } from "@/lib/utils";

const isLoading = ref(false);
async function onSubmit(event: Event) {
  event.preventDefault();
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    navigateTo("/login");
  }, 3000);
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-4">
        <div class="grid gap-1">
          <UiLabel class="" for="email"> Username or Email </UiLabel>
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
          <UiLabel class="" for="newPassword">New Password </UiLabel>
          <UiInput
            id="newPassword"
            placeholder="******"
            type="text"
            auto-capitalize="none"
            auto-complete=""
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <UiLabel class="" for="confirmPassword"
            >Re-enter New Password
          </UiLabel>
          <UiInput
            id="confirmPassword"
            placeholder="******"
            type="text"
            auto-capitalize="none"
            auto-complete=""
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>

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
