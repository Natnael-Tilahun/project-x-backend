<!-- IconPicker.vue -->
<script setup>
import { ref, computed, watchEffect } from "vue";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash-es";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// Properly declare emits
const emit = defineEmits(["select"]);

const searchQuery = ref("");
const icons = Object.values(fas).map((icon) => icon.iconName);
const filteredIcons = ref([...icons]);

// Debounced search with proper cleanup
const updateFilter = debounce((query) => {
  filteredIcons.value = icons.filter((icon) =>
    icon.toLowerCase().includes(query.toLowerCase())
  );
}, 200);

watchEffect(() => {
  const query = searchQuery.value;
  updateFilter(query);
});

// Proper select handler
const handleSelect = (iconName) => {
  emit("select", iconName);
};
</script>

<template>
  <div class="icon-picker">
    <UiInput v-model="searchQuery" placeholder="Search icons..." class="mb-4" />

    <div class="grid grid-cols-8 gap-4 max-h-96 overflow-y-auto">
      <div
        v-for="icon in filteredIcons"
        :key="icon"
        class="cursor-pointer p-2 hover:bg-gray-100 rounded flex flex-col items-center"
        @click="handleSelect(icon)"
      >
        <font-awesome-icon :icon="['fas', icon]" class="text-2xl mb-1" />
        <span class="text-xs text-gray-500 text-center">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-picker .svg-inline--fa {
  display: inline-block;
  height: 1em;
  vertical-align: -0.125em;
}
</style>
