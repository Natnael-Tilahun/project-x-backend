<template>
  <NuxtLayout>
    <UiToaster />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useInactivityTimer } from '~/composables/useInactivityTimer';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { setupInactivityTimer } = useInactivityTimer(3); // 30 minutes timeout

// Setup inactivity timer when user is authenticated
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    const cleanup = setupInactivityTimer();
    // Cleanup when component is unmounted
    onUnmounted(() => {
      cleanup();
    });
  }
}, { immediate: true });
</script>
