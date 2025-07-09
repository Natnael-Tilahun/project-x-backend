<template>
    <div class="fixed inset-0 top-0  flex items-center justify-center bg-red-100 z-50">
      <div class="bg-white border-t-8 border-[#83257a] shadow-2xl rounded-xl px-8 py-12 max-w-md w-full text-center animate-fade-in">
        <div class="flex justify-center mb-4">
          <!-- 404 Icon -->
          <svg class="h-16 w-16 text-[#83257a]" fill="none" viewBox="0 0 48 48" stroke="currentColor">
            <circle cx="24" cy="24" r="22" stroke-width="3" class="text-[#e9d5ec]" />
            <text x="24" y="32" text-anchor="middle" font-size="18" fill="#83257a" font-weight="bold">404</text>
          </svg>
        </div>
        <h2 class="text-xl md:text-2xl font-bold text-[#83257a] mb-2">
          Page Not Found
        </h2>
        <p class="text-gray-700 mb-6 text-sm md:text-base">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <NuxtLink
          to="/"
          class="w-full inline-block bg-[#83257a] hover:bg-[#6d2066] text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  // You can access the error object if you want to show different messages for other errors
  const props = defineProps<{ error: { statusCode: number, message: string } }>();
  definePageMeta({
  layout: false,
});
  </script>
  
  <style scoped>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px);}
    to { opacity: 1; transform: translateY(0);}
  }
  .animate-fade-in {
    animation: fade-in 0.4s cubic-bezier(0.4,0,0.2,1);
  }
  </style> 