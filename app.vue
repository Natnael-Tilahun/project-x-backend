<template>
  <NuxtLayout>
    <UiToaster />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useInactivityTimer } from "~/composables/useInactivityTimer";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const { setupInactivityTimer } = useInactivityTimer(10); // 3 minutes timeout
const { logout } = useAuth();

// Setup inactivity timer when user is authenticated
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      const cleanup = setupInactivityTimer();

      // Add event listener for page refresh
      const handleBeforeUnload = () => {
        logout();
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup when component is unmounted
      onUnmounted(() => {
        cleanup();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      });
    }
  },
  { immediate: true }
);
</script>
