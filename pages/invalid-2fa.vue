<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "~/components/ui/toast";
import type { OtpDTO } from "~/types";

const { requestTwoFactorAuth, isLoading } = useAuth();
const { toast } = useToast();

const loading = ref(false);
const isError = ref(false);
const data = ref<OtpDTO>();
// Page Meta Configuration
definePageMeta({
  layout: false,
});

const generateNewOTP = async () => {
  try {
    loading.value = true;
    const response = await requestTwoFactorAuth("email"); // Call your API function to fetch profile
    data.value = response ? response : undefined;
    console.log("New 2fa token; ", response);
    toast({
      title: "Two factor token Created",
      description: "Two factor token created successfully",
    });
    navigateTo(`/validate-otp`);
  } catch (err: any) {
    console.error("Error creating two factor token:", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="container relative h-[800px] md:h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <!-- Background Image Section -->
    <div
      class="relative hidden h-screen flex-col bg-muted p-0 text-white dark:border-r lg:flex"
    >
      <div
        class="w-full h-full bg-cover bg-center contrast-75"
        style="background-image: url('/Ethiopia_Commercial-Bank_building.jpeg')"
      ></div>
      <div class="absolute bottom-0 z-20 p-5 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg text-secondary/80 contrast-200">
            &ldquo;The Bank You Can Always Rely On&rdquo;
          </p>
          <footer class="text-sm">Commercial bank of Ethiopia</footer>
        </blockquote>
      </div>
    </div>

    <!-- Content Section -->
    <div
      class="md:p-8 p-5 shadow-md rounded-md border-[0.5px] lg:border-none lg:shadow-none"
    >
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            Invalid Two-Factor Authentication
          </h1>
          <p class="text-sm text-muted-foreground">
            Your two-factor authentication code is invalid or has expired.
          </p>
        </div>

        <!-- Error Icon -->
        <div class="flex justify-center">
          <div class="rounded-full bg-red-100 p-4">
            <svg
              class="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            Please generate a new OTP code to continue with the authentication
            process.
          </p>
        </div>

        <!-- Generate OTP Button -->
        <UiButton
          @click="generateNewOTP"
          :disabled="loading"
          class="w-full"
          :class="{ 'opacity-75 cursor-not-allowed': loading }"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="loading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          {{ loading ? "Generating..." : "Generate New OTP" }}
        </UiButton>

        <!-- Back to Login Link -->
        <UiButton variant="outline" class="w-full">
          <NuxtLink
            to="/login"
            class="flex items-center justify-center space-x-2"
          >
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Login</span>
          </NuxtLink>
        </UiButton>

        <!-- Help Text -->
        <p class="text-center text-xs text-muted-foreground">
          Having trouble? Contact support for assistance.
        </p>

        <UiCopyright />
      </div>
    </div>
  </div>
</template>


