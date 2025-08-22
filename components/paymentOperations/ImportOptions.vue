<template>
  <div class="container mx-auto p-4 md:p-8 max-w-3xl">
    <div class="mb-8">
      <h1 class="text-xl font-bold text-gray-800">Choices Configurator</h1>
      <p class="text-gray-500 text-sm">A tool to build a JSON `choices` array for a dropdown field.</p>
    </div>

    <div class="space-y-8">
      <!-- Section 1: Manage Choices (The "Action" Area) -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Manage Choices</h2>
        <!-- Manual Add -->
        <form @submit.prevent="addManualChoice" class="grid grid-cols-2 gap-4 pb-4 border-b">
          <UiInput type="text" v-model="manualEntry.text" class="w-full p-2 border rounded-md" placeholder="Text*" />
          <UiInput type="text" v-model="manualEntry.value" class="w-full p-2 border rounded-md" placeholder="Value*" />
          <UiInput type="text" v-model="manualEntry.icon" class="w-full p-2 border rounded-md" placeholder="Icon URL" />
          <!-- <input type="text" v-model="manualEntry.color" class="w-full p-2 border rounded-md" placeholder="Color"> -->
          <div class="flex gap-2 w-full col-span-full">
            <UiInput type="color" class="w-1/5" v-model="manualEntry.color"  />
            <UiInput type="text" placeholder="Enter color" v-model="manualEntry.color"  />
        </div>
          <UiButton type="submit" class="col-span-2 w-full bg-primary text-white font-bold py-2 px-4 rounded-lg">Add Choice Manually</UiButton>
        </form>
        <!-- Import Section -->
        <div class="mt-4">
          <button @click="toggleImporter" class="w-full text-primary font-semibold text-left">
            <span v-if="!isImporterVisible">›</span><span v-else>▾</span> Import from JSON File
          </button>
          <div v-if="isImporterVisible" class="mt-4 space-y-4">
            <input type="file" ref="jsonFileInput" @change="handleFileSelect" accept="application/json" class="hidden">
            <label @click="$refs.jsonFileInput.click()" class="w-full bg-gray-100 border border-dashed py-3 px-4 rounded-lg hover:bg-gray-200 block text-center cursor-pointer">
              {{ selectedFileName || 'Click to Select JSON File' }}
            </label>
            
            <div v-if="jsonFileContent">
              <h3 class="text-sm font-semibold text-gray-600 mb-1">JSON Preview (First 5 Items)</h3>
              <pre class="json-viewer" v-html="highlightedJsonPreview"></pre>
            </div>
            
            <div v-if="discoveredKeys.length" class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-600">Map Fields</h3>
              <select v-model="mapping.text" class="w-full p-2 border rounded-md">
                <option value="">Map to 'text'*</option>
                <option v-for="key in discoveredKeys" :key="key" :value="key">{{ key }}</option>
              </select>
              <select v-model="mapping.value" class="w-full p-2 border rounded-md">
                <option value="">Map to 'value'*</option>
                <option v-for="key in discoveredKeys" :key="key" :value="key">{{ key }}</option>
              </select>
              <select v-model="mapping.icon" class="w-full p-2 border rounded-md">
                <option value="">Map to 'icon'</option>
                <option v-for="key in discoveredKeys" :key="key" :value="key">{{ key }}</option>
              </select>
              <select v-model="mapping.color" class="w-full p-2 border rounded-md">
                <option value="">Map to 'color'</option>
                <option v-for="key in discoveredKeys" :key="key" :value="key">{{ key }}</option>
              </select>
              <button @click="generatePreview" class="w-full bg-gray-700 text-white py-2 rounded-lg">Preview Mapped Choices</button>
            </div>

            <div v-if="previewedChoices.length > 0">
              <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                <div v-for="choice in previewedChoices" :key="choice.id" class="flex items-center justify-between bg-gray-100 p-2 rounded-lg border">
                  <div class="flex items-center gap-2 text-sm flex-grow min-w-0">
                    <div v-if="choice.color" class="w-4 h-4 rounded-full flex-shrink-0 border" :style="{ backgroundColor: choice.color }"></div>
                    <img v-if="choice.icon" :src="choice.icon" class="w-5 h-5 object-contain flex-shrink-0">
                    <span class="truncate" :title="choice.text">{{ choice.text }}</span>
                    <span class="font-mono text-gray-500 ml-auto mr-2 flex-shrink-0">({{ choice.value }})</span>
                  </div>
                  <button @click="removePreviewChoice(choice.id)" class="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                </div>
              </div>
              <UiButton @click="addPreviewedToMain" class="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg mt-4">Add These Choices</UiButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Configured Choices (The "Working List") -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Configured Choices</h2>
        <p class="text-sm text-gray-500 mb-4">Select one choice as the default.</p>
        <div class="space-y-2 min-h-[10rem] max-h-96 overflow-y-auto pr-2">
          <p v-if="!currentChoices.length" class="text-gray-500 italic p-4 text-center">Add choices to see them here.</p>
          <div v-for="choice in currentChoices" :key="choice.value" class="flex items-center justify-between bg-gray-100 p-2 rounded-lg border">
            <div class="flex items-center gap-2 text-sm flex-grow min-w-0">
              <input type="radio" name="default-choice" :value="choice.value" v-model="defaultChoiceValue" class="h-4 w-4 mr-3 flex-shrink-0">
              <div v-if="choice.color" class="w-4 h-4 rounded-full flex-shrink-0 border" :style="{ backgroundColor: choice.color }"></div>
              <img v-if="choice.icon" :src="choice.icon" class="w-5 h-5 object-contain flex-shrink-0">
              <span class="truncate" :title="choice.text">{{ choice.text }}</span>
              <span class="font-mono text-gray-500 ml-auto mr-2 flex-shrink-0">({{ choice.value }})</span>
            </div>
            <button @click="removeChoice(choice.value)" class="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
          </div>
        </div>
      </div>

      <!-- Section 3: Final Output -->
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-700">Final JSON Output</h2>
          <button @click="copyToClipboard" class="bg-gray-200 text-gray-800 text-xs font-bold py-1 px-3 rounded-md hover:bg-gray-300">{{ copyButtonText }}</button>
        </div>
        <pre class="json-viewer" v-html="finalJsonOutput"></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  choices: { type: Array, default: () => [] },
  updateChoices: { type: Function, default: null }
})

// --- STATE ---
const currentChoices = ref([])
const defaultChoiceValue = ref(null)
const manualEntry = ref({ text: '', value: '', icon: '', color: '' })
const isImporterVisible = ref(false)
const jsonFileContent = ref(null)
const selectedFileName = ref('')
const discoveredKeys = ref([])
const mapping = ref({ text: '', value: '', icon: '', color: '' })
const previewedChoices = ref([])
const copyButtonText = ref('Copy JSON')
const jsonFileInput = ref(null)

// Sync incoming choices from parent and derive default
watch(
  () => props.choices,
  (newChoices) => {
    const incoming = Array.isArray(newChoices) ? JSON.parse(JSON.stringify(newChoices)) : []
    currentChoices.value = incoming.map(c => ({
      text: c.text,
      value: c.value,
      icon: c.icon || null,
      color: c.color || null,
      isDefault: !!c.isDefault,
    }))
    const def = currentChoices.value.find(c => c.isDefault)
    defaultChoiceValue.value = def ? def.value : null
  },
  { immediate: true, deep: true }
)

function notifyParent() {
  if (typeof props.updateChoices === 'function') {
    const payload = currentChoices.value.map(c => ({
      text: c.text,
      value: c.value,
      icon: c.icon || null,
      color: c.color || null,
      isDefault: c.value === defaultChoiceValue.value
    }))
    props.updateChoices(payload)
  }
}
watch(defaultChoiceValue, () => notifyParent())

// --- METHODS ---
function syntaxHighlight(json) {
  if (!json) return '<span class="json-null">null</span>'
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'json-number'
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? 'json-key' : 'json-string'
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean'
    } else if (/null/.test(match)) {
      cls = 'json-null'
    }
    return `<span class="${cls}">${match}</span>`
  })
}

function addManualChoice() {
  if (!manualEntry.value.text || !manualEntry.value.value) return
  currentChoices.value.push({ ...manualEntry.value })
  manualEntry.value = { text: '', value: '', icon: '', color: '' }
  notifyParent()
}

function removeChoice(value) {
  currentChoices.value = currentChoices.value.filter(c => c.value !== value)
  if (defaultChoiceValue.value === value) defaultChoiceValue.value = null
  notifyParent()
}

function resetImporter() {
  jsonFileContent.value = null
  previewedChoices.value = []
  discoveredKeys.value = []
  mapping.value = { text: '', value: '', icon: '', color: '' }
  selectedFileName.value = ''
  if (jsonFileInput.value) {
    jsonFileInput.value.value = ''
  }
}

function toggleImporter() {
  isImporterVisible.value = !isImporterVisible.value
  if (!isImporterVisible.value) resetImporter()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) {
    resetImporter()
    return
  }
  selectedFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    jsonFileContent.value = e.target.result
    try {
      const data = JSON.parse(jsonFileContent.value)
      discoveredKeys.value = (Array.isArray(data) && data.length > 0) ? Object.keys(data[0]) : []
    } catch (err) {
      discoveredKeys.value = []
    }
  }
  reader.readAsText(file)
}

function generatePreview() {
  if (!jsonFileContent.value || !mapping.value.text || !mapping.value.value) return
  let rawData
  try {
    rawData = JSON.parse(jsonFileContent.value)
  } catch (e) {
    return
  }
  if (!Array.isArray(rawData)) return
  previewedChoices.value = rawData.map(item => ({
    id: crypto.randomUUID(),
    text: item[mapping.value.text],
    value: item[mapping.value.value],
    icon: mapping.value.icon ? item[mapping.value.icon] : null,
    color: mapping.value.color ? item[mapping.value.color] : null,
  })).filter(c => c.text != null && c.value != null)
}

function removePreviewChoice(id) {
  previewedChoices.value = previewedChoices.value.filter(c => c.id !== id)
}

function addPreviewedToMain() {
  const newChoices = previewedChoices.value.map(({ id, ...rest }) => rest)
  currentChoices.value.push(...newChoices)
  notifyParent()
  toggleImporter()
}

// --- COMPUTED ---
const finalJsonOutput = computed(() => {
  const final = currentChoices.value.map(choice => ({
    text: choice.text,
    value: choice.value,
    icon: choice.icon || null,
    color: choice.color || null,
    isDefault: choice.value === defaultChoiceValue.value
  }))
  return syntaxHighlight(JSON.stringify(final, null, 2))
})


function copyToClipboard() {
  const plainJson = JSON.stringify(JSON.parse(finalJsonOutput.value.replace(/<[^>]*>/g, '')), null, 2)
  navigator.clipboard.writeText(plainJson).then(() => {
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy JSON'
    }, 2000)
  })
}
</script>

<style scoped>
.json-viewer {
  background-color: #1f2937;
  color: #e5e7eb;
  border: 1px solid #4b5563;
  max-height: 220px;
  overflow: auto;
  white-space: pre;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem;
  border-radius: 0.5rem;
}

.json-key {
  color: #38bdf8;
}

.json-string {
  color: #34d399;
}

.json-number {
  color: #facc15;
}

.json-boolean {
  color: #f472b6;
}

.json-null {
  color: #9ca3af;
}
</style>