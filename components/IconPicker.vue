<!-- IconPicker.vue -->
<script setup>
import {
  ref,
  watch,
  onBeforeUnmount,
  onMounted,
  computed,
  nextTick,
} from "vue"; // Import nextTick
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

// Initialize FontAwesome library
library.add(fas);

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
  code: icon.icon[3], // Add the icon's code to the searchIndex
  searchTerm: icon.iconName.toLowerCase(),
}));

// Using Computed Property for Filtered Icons
const filteredIcons = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) {
    return icons;
  }
  return searchIndex.filter(({ searchTerm }) => searchTerm.includes(q));
});

// // Watch the computed property to log its changes
// watch(filteredIcons, (newFilteredIcons) => {
//   console.log("filteredIcons (watch): ", newFilteredIcons); // Log the value after it changes
// });

const handleSelect = (icon) => {
  const code = icon.icon ? icon.icon[3] : icon.code; // Use the code from searchIndex if available
  emit("update:modelValue", code);
  emit("select", code);
  showPicker.value = false;
  searchQuery.value = "";

  nextTick(() => {
    searchQuery.value = "";
    showPicker.value = false;
  });
};

const handleInput = (event) => {
  const input = event.target.value.toLowerCase();
  emit("update:modelValue", input);
  emit("select", input);
};

const clearIcon = () => {
  emit("update:modelValue", "");
  emit("select", "");
};

const togglePicker = () => {
  showPicker.value = !showPicker.value;
  // Force searchQuery to be empty after the DOM updates
  nextTick(() => {
    searchQuery.value = "";
  });
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
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="icon-picker w-full" ref="pickerContainer">
    <div class="relative flex gap-2 items-center">
      <UiInput
        type="text"
        placeholder="Select or type icon name"
        :model-value="modelValue"
        class="cursor-pointer"
        @click.prevent="togglePicker"
        @input="handleInput"
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
          :key="icon.code || icon.iconName"
          class="cursor-pointer p-4 hover:bg-gray-100 rounded-lg flex flex-col items-center"
          @click="handleSelect(icon)"
        >
          <font-awesome-icon
            :icon="['fas', icon.iconName || icon.searchTerm]"
            class="text-2xl mb-1"
          />
          <span class="text-xs text-gray-500 text-center line-clamp-1">
            {{ icon.iconName || icon.searchTerm }}
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
