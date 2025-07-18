<!-- components/JsonInspector.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import JsonNode from '@/components/JsonNode.vue'

const props = defineProps<{
  data: any
}>()

// State for selected path/value
const selectedPath = ref<string | null>(null)
const selectedValue = ref<any>(null)
const copyPathButtonText = ref('Copy Path')
const copyValueButtonText = ref('Copy Value')

// Handle node click from JsonNode
function handleNodeClick({ path, value }: { path: string, value: any }) {
  selectedPath.value = path
  selectedValue.value = value
}

// Copy logic with feedback
async function copyToClipboardWithFeedback(text: string, type: 'path' | 'value') {
  try {
    await navigator.clipboard.writeText(text)
    if (type === 'path') {
      copyPathButtonText.value = 'Copied!'
      setTimeout(() => { copyPathButtonText.value = 'Copy Path' }, 2000)
    } else {
      copyValueButtonText.value = 'Copied!'
      setTimeout(() => { copyValueButtonText.value = 'Copy Value' }, 2000)
    }
  } catch (err) {
    // fallback: do nothing
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <!-- Path/Value Viewer -->
    <div class="mb-2 p-2 rounded-md font-mono text-xs border bg-blue-50 border-blue-200 text-blue-800">
      <div v-if="selectedPath !== null" class="flex flex-col gap-1">
        <div>
          <span class="font-bold">Path:</span>
          <span class="break-all">{{ selectedPath }}</span>
        </div>
        <div>
          <span class="font-bold">Value:</span>
          <span class="break-all">
            <template v-if="typeof selectedValue === 'object'">
              {{ JSON.stringify(selectedValue, null, 2) }}
            </template>
            <template v-else>
              {{ selectedValue }}
            </template>
          </span>
        </div>
        <div class="flex gap-2 mt-1">
          <button
            @click="copyToClipboardWithFeedback(selectedPath, 'path')"
            :class="copyPathButtonText === 'Copied!' ? 'bg-green-500 text-white' : 'bg-white text-blue-700 border-blue-700'"
            class="px-3 py-1 text-xs font-semibold border rounded-md hover:bg-blue-100 transition-colors"
          >
            {{ copyPathButtonText }}
          </button>
          <button
            @click="copyToClipboardWithFeedback(
              typeof selectedValue === 'object'
                ? JSON.stringify(selectedValue, null, 2)
                : String(selectedValue),
              'value'
            )"
            :class="copyValueButtonText === 'Copied!' ? 'bg-green-500 text-white' : 'bg-white text-blue-700 border-blue-700'"
            class="px-3 py-1 text-xs font-semibold border rounded-md hover:bg-blue-100 transition-colors"
          >
            {{ copyValueButtonText }}
          </button>
        </div>
      </div>
      <div v-else class="text-gray-400">Click a property to see its path and value.</div>
    </div>
    <!-- JSON Tree -->
    <div class="font-mono text-sm overflow-auto whitespace-pre bg-white border h-full border-gray-200 rounded-md p-2">
      <JsonNode
        :data="data"
        path="root"
        @node-clicked="handleNodeClick"
      />
    </div>
  </div>
</template>
