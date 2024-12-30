<script lang="ts" setup>
import { ref, h } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  return false
})
</script>

<template>
  <div>
    <div v-if="error" class="error-boundary p-4 border border-red-500 rounded-lg">
      <h2 class="text-lg font-semibold text-red-600">Something went wrong</h2>
      <button
        class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        @click="() => {
          error = null
          window.location.reload()
        }"
      >
        Try again
      </button>
    </div>
    <slot v-else></slot>
  </div>
</template> 