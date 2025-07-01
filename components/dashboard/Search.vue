<script setup lang="ts">
import { hidden } from '@unovis/ts/components/tooltip/style';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mainLinks } from '~/constants/mainLinks';
import type { MenuItem, SearchResult } from '~/types';

const searchQuery = ref('');
const router = useRouter();
const authStore = useAuthStore();

// Computed property to filter menu items based on search query
const filteredMenuItems = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  const results: SearchResult[] = [];

  mainLinks.forEach(link => {
    // Check main menu item
    if (link.title.toLowerCase().includes(query) && link.link) {
      results.push({
        title: link.title,
        link: link.link,
        icon: link.icon,
        isMainMenu: true,
        permission: link?.permission
      });
    }

    // Check dropdown items if they exist
    if (link.dropdown) {
      link.dropdown.forEach(item => {
        if (item.title.toLowerCase().includes(query)) {
          results.push({
            title: item.title,
            link: item.link,
            icon: link.icon,
            isMainMenu: false,
            parentMenu: link.title,
            permission: item?.permission
          });
        }
      });
    }
  });

  return results;
});


// Function to handle menu item click
const handleMenuItemClick = (item: SearchResult) => {
  router.push(item.link);
  searchQuery.value = ''; // Clear search after navigation
};

// Add this helper function
const hasVisibleDropdownItems = (link: MenuItem) => {
  return link.permission ? (authStore as any).hasPermissions(link.permission ?? '') : true;
};
</script>

<template>
  <div class="relative text-foreground">
    <UiInput
      v-model="searchQuery"
      type="search"
      placeholder="Search menus..."
      class="md:w-[100px] lg:w-[300px]"
    />
    
    <!-- Search Results Dropdown -->
    <div
      v-if="searchQuery && filteredMenuItems.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto"
    >
      <div class="p-2">
        <div v-for="(item, index) in filteredMenuItems" :key="index">
          <button
            @click="handleMenuItemClick(item)"
            :class="hasVisibleDropdownItems(item)? '':'hidden'"
            class="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-2"
          >
            <Icon :name="item.icon" size="20" />
            <div class="flex flex-col">
              <span class="font-medium">{{ item.title }}</span>
              <span v-if="!item.isMainMenu" class="text-xs text-muted-foreground">
                {{ item.parentMenu }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Results Message -->
    <div
      v-if="searchQuery && filteredMenuItems.length === 0"
      class="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 p-3"
    >
      <p class="text-muted-foreground">No menu items found</p>
    </div>
  </div>
</template>
