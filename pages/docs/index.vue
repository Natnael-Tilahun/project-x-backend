<template>
  <iframe
    :src="swaggerUrl"
    width="100%"
    height="900"
    seamless
    target="_top"
    title="Swagger UI"
    class="border-0"
    data-cy="swagger-frame"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'JhiDocs',
  setup() {
    // Use your env variable here. Adjust the variable name as needed.
    const swaggerUrl = computed(() => `${__API_BASE_URL__}/swagger-ui/index.html`);
    return { swaggerUrl };
  },
});
</script>
