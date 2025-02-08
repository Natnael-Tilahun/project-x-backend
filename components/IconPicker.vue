<!-- IconPicker.vue -->
<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

// Initialize FontAwesome library
library.add(fas);

// Add console log to check icons loading
console.log('Icons loaded:', Object.keys(fas).length);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "select"]);

const searchQuery = ref("");
const showPicker = ref(false);
const pickerContainer = ref(null);
const icons = Object.values(fas);
const filteredIcons = ref(icons);

// Create code-to-icon map
const codeMap = Object.values(fas).reduce((acc, icon) => {
  acc[icon.icon[3]] = ["fas", icon.iconName];
  return acc;
}, {});

const getIconFromCode = (code) => {
  return codeMap[code] || ["fas", "question-circle"];
};

// Precompute lowercase names for faster search
const searchIndex = icons.map((icon) => ({
  ...icon,
  searchTerm: icon.iconName.toLowerCase(),
}));

// Optimized debounced filter
const debouncedFilter = debounce((query) => {
  const q = query.toLowerCase().trim();
  filteredIcons.value = q
    ? searchIndex.filter(({ searchTerm }) => searchTerm.includes(q))
    : icons;
}, 200);

// Immediate response to clear
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    filteredIcons.value = icons;
    debouncedFilter.cancel();
  } else {
    debouncedFilter(newQuery);
  }
});

const handleSelect = (icon) => {
  const code = icon.icon[3];
  emit("update:modelValue", code);
  emit("select", code);
  showPicker.value = false;
  searchQuery.value = "";
};

const clearIcon = () => {
  emit("update:modelValue", "");
  emit("select", "");
};

const togglePicker = () => {
  console.log('Toggle picker called, current state:', showPicker.value);
  showPicker.value = !showPicker.value;
  console.log('New picker state:', showPicker.value);
};

const handleClickOutside = (event) => {
  if (pickerContainer.value && !pickerContainer.value.contains(event.target)) {
    showPicker.value = false;
    searchQuery.value = "";
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  debouncedFilter.cancel();
  document.removeEventListener("click", handleClickOutside);
});

// Add console log to check filtered icons
watch(filteredIcons, (newValue) => {
  console.log('Filtered icons count:', newValue.length);
}, { immediate: true });
</script>

<template>
  <div class="icon-picker w-full" ref="pickerContainer">
    <div class="relative flex gap-2 items-center">
      <UiInput
        type="text"
        placeholder="Select icon"
        :model-value="modelValue"
        class="cursor-pointer"
        @click.prevent="togglePicker"
      />

      <FontAwesomeIcon
        v-if="modelValue"
        :icon="getIconFromCode(modelValue)"
        class="absolute right-12 top-3 w-5 h-5 text-gray-700"
      />
      
      <!-- Clear Button -->
      <button
        v-if="modelValue"
        @click.stop="clearIcon"
        class="text-red-400 hover:text-red-600 border p-1 rounded-lg border-red-400 flex items-center justify-center"
        title="Clear icon"
      >
        <Icon name="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <!-- Icon Picker Dropdown -->
    <div
      v-show="showPicker"
      class="absolute top-full left-0 w-full z-[100] mt-2 bg-white rounded-lg border p-2 shadow-lg"
    >
      <UiInput
        v-model="searchQuery"
        placeholder="Search icons..."
        class="mb-4"
        @keydown.esc="searchQuery = ''"
      />

      <div
        class="grid grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto border rounded-lg p-4"
      >
        <div
          v-for="icon in filteredIcons"
          :key="icon.iconName"
          class="cursor-pointer p-4 hover:bg-gray-100 rounded-lg flex flex-col items-center"
          @click="handleSelect(icon)"
        >
          <font-awesome-icon
            :icon="['fas', icon.iconName]"
            class="text-2xl mb-1"
          />
          <span class="text-xs text-gray-500 text-center line-clamp-1">
            {{ icon.iconName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-picker {
  position: relative;
  width: 100%;
}

.icon-picker .svg-inline--fa {
  display: inline-block;
  height: 1em;
  vertical-align: -0.125em;
  transition: color 0.2s ease;
}

.icon-picker .svg-inline--fa:hover {
  color: #3b82f6;
}
</style>
