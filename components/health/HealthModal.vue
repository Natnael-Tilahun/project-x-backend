<template>
  <div class="modal-body pad">
    <div v-if="currentHealth && currentHealth.details">
      <h5>Properties</h5>
      <div class="table-responsive">
        <table class="table table-striped" aria-describedby="Health">
          <thead>
            <tr>
              <th class="text-left" scope="col">Name</th>
              <th class="text-left" scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in currentHealth.details" :key="key">
              <td class="text-left">{{ key }}</td>
              <td class="text-left">{{ readableValue(value) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="currentHealth && currentHealth.error">
      <h4>Error</h4>
      <pre>{{ currentHealth.error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentHealth: any
}>();

function readableValue(value: any): string {
  if (props.currentHealth?.name === 'diskSpace') {
    const val = value / 1073741824;
    if (val > 1) {
      return `${val.toFixed(2)} GB`;
    }
    return `${(value / 1048576).toFixed(2)} MB`;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value?.toString?.() ?? '';
}
</script>
