<script setup>
// components/PermissionGuard.vue
const props = defineProps({
  permission: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  any: {
    type: Boolean,
    default: false
  }
})

const store = useAuthStore()
const hasAccess = computed(() => {
  if (props.any) {
    return props.permission && store.hasPermissions(props.permission) || 
           props.role && store.hasRole(props.role)
  }
  
  return (!props.permission || store.hasPermissions(props.permission)) && 
         (!props.role || store.hasRole(props.role))
})
</script>

<template>
  <slot v-if="hasAccess" />
</template>