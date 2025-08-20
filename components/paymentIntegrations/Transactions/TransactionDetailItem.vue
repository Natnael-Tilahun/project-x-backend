<template>
  <div class="flex flex-col space-y-1">
    <span class="text-sm font-medium text-muted-foreground">{{ label }}</span>
    <span v-if="!status" class="text-sm font-medium">
      {{ value ?? "-" }}
    </span>
    <UiBadge
      v-else
      variant="outline"
      class="inline-flex items-center w-fit rounded-full text-xs font-medium"
      :class="getBadgeClass(value) || ''"
    >
      {{ value ?? "-" }}
    </UiBadge>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  label: string;
  value: string | number | null;
  status?: boolean;
}>();

function getBadgeClass(statusState: string) {
  if(String(statusState).toLowerCase() === 'completed' || String(statusState).toUpperCase() == 'SUCCESS'){
    return  ('bg-green-500')
  }
  else if(String(statusState).toLowerCase() === 'pending'){
    return ('bg-yellow-500')
  }
  else if(String(statusState).toLowerCase() === 'failed' || String(statusState).toLowerCase() === 'expired' || String(statusState).toLowerCase() === 'failure'){
    return ('bg-red-500')
  }
}
</script>
