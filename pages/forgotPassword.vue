<script setup lang="ts">
import { buttonVariants } from "~/components/ui/button";
import { cn } from "@/lib/utils";
import ForgotPasswordForm from "~/components/forgotPassword/ForgotPasswordForm.vue";

definePageMeta({
  layout: false,
});
</script>

<template>
  <div
    class="container w-full relative h-[800px] md:h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <NuxtLink
      to="/login"
      :class="
        cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )
      "
    >
      Login
    </NuxtLink>
    <div
      class="relative hidden h-screen flex-col bg-muted p-0 text-white dark:border-r lg:flex"
    >
      <div
        class="w-full h-full bg-cover bg-center contrast-75"
        style="background-image: url('/Ethiopia_Commercial-Bank_building.jpeg')"
      ></div>
      <!-- </div> -->
      <div class="absolute bottom-0 z-20 p-5 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg text-secondary/80 contrast-200">
            &ldquo;The Bank You Can Always Rely On&rdquo;
          </p>
          <footer class="text-sm">Commercial bank of Ethiopia</footer>
        </blockquote>
      </div>
    </div>
    <div
      class="md:p-8 p-5 shadow-md rounded-md border-[0.5px] lg:border-none lg:shadow-none"
    >
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Create new password
          </h1>
        </div>
        <ForgotPasswordForm />
        <p class="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our
          <a
            href="/terms"
            class="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>
          and
          <a
            href="/privacy"
            class="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
        <UiCopyright />
      </div>
    </div>
  </div>
</template>
