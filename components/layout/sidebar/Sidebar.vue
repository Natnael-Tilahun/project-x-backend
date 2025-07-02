<template>
  <NuxtScrollbar
    tag="aside"
    class="bg-background text-sm text-secondary-foreground py-0 font-medium border-r shadow-xl shrink-0"
  >
    <div
      class="flex w-full items-center h-16 justify-between px-3 py-0 border-b"
    >
      <h1
        class="lg:text-3xl text-xl font-black px-4 md:px-5 text-primary self-center"
      >
        Project-X
      </h1>
      <Icon
        name="material-symbols:cancel"
        size="26"
        @click="closeMenuNav"
        class="md:hidden md:w-0"
      ></Icon>
    </div>

    <ul class="flex flex-col gap-4 p-5">
      <template v-for="(link, index) in mainLinks" :key="index">
        <UiCollapsible
          v-if="link.dropdown && hasVisibleDropdownItems(link)"
          class="w-full p-0 rounded-lg hover:bg-popover px-0 shadow-none group"
          type="single"
          v-model:open="isOpen[index]"
        >
          <UiCollapsibleTrigger
            class="p-3 shadow-none w-full hover:text-primary"
          >
            <NuxtLink
              :to="link.link"
              class="flex gap-3 items-center w-full py-0 rounded-lg transition text-left"
            >
              <span><Icon :name="link.icon" :size="link.size"></Icon></span>
              <p class="mr-auto">{{ link.title }}</p>

              <Icon
                name="material-symbols:keyboard-arrow-down-rounded"
                size="22"
              ></Icon>
            </NuxtLink>
          </UiCollapsibleTrigger>

          <!-- Check if the link has a dropdown -->
          <UiCollapsibleContent>
            <ul
              class="dropdown-menu rounded-none flex flex-col gap-0 py-2 px-4"
            >
              <template
                v-for="(item, dropdownIndex) in link.dropdown"
                :key="dropdownIndex"
              >
                <UiPermissionGuard :permission="item?.permission">
                  <NuxtLink
                    :to="item.link"
                    @click="closeMenuNav"
                    class="w-full border-l-2 hover:rounded-r-lg group-hover:border-primary hover:bg-accent px-4 py-3 hover:text-primary"
                    :class="{
                      'text-primary bg-[#8C2A7C]/15 rounded-lg font-bold':
                        isRouteActive(item.link),
                    }"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </UiPermissionGuard>
              </template>
            </ul>
          </UiCollapsibleContent>
        </UiCollapsible>

        <UiPermissionGuard
          v-if="!link?.dropdown"
          :permission="link?.permission"
        >
          <NuxtLink
            v-if="!link.dropdown"
            :to="link.link"
            @click="closeMenuNav"
            :class="{
              'text-primary-foreground bg-primary font-bold': isRouteActive(
                link?.link ?? ''
              ),
            }"
            class="flex gap-3 py-3 px-2 hover:bg-popover hover:text-primary rounded-lg transition"
          >
            <span><Icon :name="link.icon" :size="link.size"></Icon></span>
            <p>{{ link.title }}</p>
          </NuxtLink>
        </UiPermissionGuard>
      </template>
    </ul>
  </NuxtScrollbar>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Add your auth store import
import type { MenuItem } from "~/types";
import { mainLinks } from "~/constants/mainLinks";

const authStore = useAuthStore();


// Initialize isOpen array with the same length as mainLinks and set all to false
const isOpen = ref(new Array(mainLinks.length).fill(false));

const emits = defineEmits(["closeMenuNav"]); // Define custom event

const closeMenuNav = () => {
  emits("closeMenuNav"); // Emit the toggleTheme event to the parent
};

const route = useRoute();
// Function to check if route is active, including parent routes
function isRouteActive(path: string) {
  if (path === "/") {
    // For dashboard, only return true if we're exactly at the root
    return route.path === "/";
  }
  // For other routes, keep the existing behavior
  return route.path.startsWith(path);
}

// Add this helper function
const hasVisibleDropdownItems = (link: MenuItem) => {
  return link.dropdown?.some((item) => (authStore as any).hasPermissions(item.permission ?? ''));
};
</script>

<style scoped>
.router-link-active {
  @apply font-bold bg-[#8C2A7C]/15 rounded-lg text-primary dark:text-primary-foreground dark:bg-[#8C2A7C]/40;
}
</style>
