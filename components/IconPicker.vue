<!-- IconPicker.vue -->
<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const emit = defineEmits(["select"]);

const searchQuery = ref("");
const icons = Object.values(fas);
const filteredIcons = ref(icons);

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

onBeforeUnmount(() => debouncedFilter.cancel());

const handleSelect = (icon) => {
  emit("select", icon.icon[3]); // Emit icon code
};
</script>

<template>
  <div class="icon-picker">
    <UiInput
      v-model="searchQuery"
      placeholder="Search icons..."
      class="mb-4"
      @keydown.esc="searchQuery = ''"
    />

    <div class="grid grid-cols-8 gap-4 max-h-96 overflow-y-auto">
      <div
        v-for="icon in filteredIcons"
        :key="icon.iconName"
        class="cursor-pointer p-2 hover:bg-gray-100 rounded flex flex-col items-center"
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
</template>

<style scoped>
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
