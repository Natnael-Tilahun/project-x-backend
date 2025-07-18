
<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean, null] as any,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  nodeKey: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['node-clicked'])
const isCollapsed = ref(false)
const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }
const JsonNode = defineAsyncComponent(() => import('@/components/JsonNode.vue'))

const dataType = computed(() => {
  if (props.data === null) return 'null'
  if (Array.isArray(props.data)) return 'array'
  return typeof props.data
})

const isCollapsible = computed(() => dataType.value === 'object' || dataType.value === 'array')

const hasChildren = computed(() => {
  if (!isCollapsible.value) return false
  return Object.keys(props.data).length > 0
})

const children = computed(() => {
  if (!isCollapsible.value) return []
  return Object.entries(props.data)
})

function onNodeClick(path: string, value: any) {
  emit('node-clicked', { path, value })
}

function onKeyClick() {
   emit('node-clicked', { path: props.path, value: props.data })
}
</script>

<template>
  <div v-if="isCollapsible" class="relative" :class="{ 'pl-5 border-l border-guide': hasChildren }">
    <span v-if="hasChildren"
          @click.stop="toggleCollapse"
          class="absolute left-0 top-[0.35em] cursor-pointer select-none transition-transform duration-150 w-0 h-0 border-4 border-transparent border-l-gray-500"
          :class="{ '-rotate-90': !isCollapsed, 'rotate-0': isCollapsed }">
    </span>
    <span v-if="nodeKey" @click.stop="onKeyClick" class="text-primary hover:bg-yellow-500/70 p-0.5 rounded-sm cursor-pointer">"{{ nodeKey }}"</span>
    <span v-if="nodeKey">: </span>
    <span class="text-json-brace">{{ dataType === 'array' ? '[' : '{' }}</span>
    <span v-if="isCollapsed && hasChildren" @click.stop="toggleCollapse" class="text-gray-400 cursor-pointer"> ... </span>
    <div v-show="!isCollapsed && hasChildren" class="pl-2">
      <div v-for="([key, value], index) in children" :key="key" class="relative">
        <JsonNode 
          :nodeKey="dataType === 'object' ? key : ''"
          :data="value"
          :path="dataType === 'array' ? `${path}[${key}]` : `${path}.${key}`"
          @node-clicked="(e) => emit('node-clicked', e)"
        />
        <span v-if="index < children.length - 1" class="text-gray-500">,</span>
      </div>
    </div>
    <span v-show="!isCollapsed || !hasChildren" class="text-json-brace">{{ dataType === 'array' ? ']' : '}' }}</span>
  </div>
  <span v-else @click.stop="onNodeClick(path, data)" class="hover:bg-yellow-500/70 p-0.5 rounded-sm cursor-pointer">
      <span v-if="nodeKey" @click.stop="onKeyClick" class="text-primary hover:bg-yellow-500/70 p-0.5 rounded-sm cursor-pointer">"{{ nodeKey }}"</span>
      <span v-if="nodeKey">: </span>
      <span v-if="dataType === 'string'" class="text-green-500">"{{ data }}"</span>
      <span v-else-if="dataType === 'number'" class="text-red-500">{{ data }}</span>
      <span v-else-if="dataType === 'boolean'" class="text-blue-500">{{ data }}</span>
      <span v-else-if="dataType === 'null'" class="text-gray-500">null</span>
  </span>
</template>
