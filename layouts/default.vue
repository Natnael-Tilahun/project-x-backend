<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Sidebar from "~/components/layout/sidebar/Sidebar.vue";
import OpenSidebarIcon from "~/components/layout/sidebar/OpenSidebarIcon.vue";
import CloseSidebarIcon from "~/components/layout/sidebar/CloseSidebarIcon.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LOCAL_STORAGE_THEME_KEY = "theme";
const isDarkMode = ref(false);

// Load theme from local storage
onMounted(() => {
  const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
  isDarkMode.value = savedTheme === "dark";
  document.body.classList.toggle("dark", isDarkMode.value);
});

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem(
    LOCAL_STORAGE_THEME_KEY,
    isDarkMode.value ? "dark" : "light"
  );
  document.body.classList.toggle("dark", isDarkMode.value);
};

const route = useRoute();
const fullPath = ref(route.path);
const pathSegments = ref([]);
pathSegments.value = splitPath(fullPath.value);

watch(
  () => route.path,
  (newVal) => {
    fullPath.value = newVal;
    pathSegments.value = splitPath(fullPath.value);
  }
);

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

function capitalizeRouteName(route: any) {
  return route.charAt(0).toUpperCase() + route.slice(1);
}

function generateLink(index: any) {
  const linkSegments = pathSegments.value.slice(0, index + 1);
  const path = linkSegments.join("/");
  return path === "/" ? path : `/${path}`;
}

const isSidebarCollapsed = useSidebarCollapsed();

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  console.log("isSidebarcollapsed : ", isSidebarCollapsed.value);
};

const closeMenuNav = () => {
  isSidebarCollapsed.value = false;
};
</script>

<template>
  <div
    :class="{ dark: isDarkMode }"
    class="w-full min-h-screen bg-background dark:bg-gray-900 dark:text-gray-100 grid grid-cols-12 lg:grid-cols-9 xl:grid-cols-7"
  >
    <!-- ' hidden  border-4 border-white   md:backdrop md:w-[250px]' -->
    <!-- 'text-green-300 w-2/3  border-4 border-white z-50 absolute top-0 md:block  md:backdrop md:w-[250px] ' -->
    <!-- Page Sidebar -->
    <Sidebar
      class="md:col-span-3 col-span-12 md:static shadow-none lg:col-span-2 xl:col-span-1 bg-popover"
      :class="[
        {
          'hidden col-span-12  md:block xl:col-span-1  md:col-span-3':
            !isSidebarCollapsed,
        },
        {
          'col-span-12 absolute w-2/3 md:hidden shadow-lg z-50':
            isSidebarCollapsed,
        },
      ]"
      @closeMenuNav="closeMenuNav"
    />

    <div
      class="col-span-full md:col-span-9 bg-secondary shadow-none dark:bg-gray-900 lg:col-span-7 xl:col-span-6 md:flex"
      :class="[
        {
          'w-full   h-full top-0 left-0 flex-col md:flex':
            !isSidebarCollapsed,
        },
        {
          ' absolute  w-full h-full flex-col flex': isSidebarCollapsed,
        },
      ]"
    >
      <!-- Page Header -->
      <div class="border-b shadow-none bg-popover text-popover-foreground">
        <div
          class="flex h-16 items-center px-3 md:px-8 bg-primary dark:bg-gray-800 text-primary-foreground shadow-xl"
        >
          <!-- <DashboardMainNav class="mx-6" /> -->
          <div class="flex items-center gap-3 md:gap-2">
            <OpenSidebarIcon v-if="isSidebarCollapsed" @click="toggleSidebar" />
            <CloseSidebarIcon v-else @click="toggleSidebar" />
            <div class="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <template v-if="pathSegments.length === 0">
                    <BreadcrumbItem>
                      <BreadcrumbPage class="text-primary-foreground font-black"
                        >Dashboard</BreadcrumbPage
                      >
                    </BreadcrumbItem>
                  </template>
                  <template v-else>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        <NuxtLink to="/" class="text-gray-200 font-medium"
                          >Dashboard</NuxtLink
                        >
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <template
                      v-for="(segment, index) in pathSegments"
                      :key="index"
                    >
                      <BreadcrumbSeparator class="text-primary-foreground" />
                      <BreadcrumbItem>
                        <template v-if="index === pathSegments.length - 1">
                          <BreadcrumbPage
                            class="text-primary-foreground font-black"
                          >
                            {{ capitalizeRouteName(segment) }}</BreadcrumbPage
                          >
                        </template>
                        <template v-else>
                          <BreadcrumbLink>
                            <NuxtLink
                              :to="generateLink(index)"
                              class="text-gray-200 font-medium"
                            >
                              {{ capitalizeRouteName(segment) }}</NuxtLink
                            >
                          </BreadcrumbLink>
                        </template>
                      </BreadcrumbItem>
                    </template>
                  </template>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <div class="ml-auto flex items-center space-x-2 md:space-x-10">
            <DashboardSearch />
            <UiButton
              variant="ghost"
              size="icon"
              @click="toggleTheme"
              class="bg-gray-700 text-primary-foreground hover:bg-gray-300 dark:bg-gray-700 dark:text-white hover:dark:bg-gray-500 rounded-full"
            >
              <Icon
                name="tdesign:mode-dark"
                size="22"
                v-if="!isDarkMode"
                class="h-[1.2rem] w-[1.2rem] transition-all"
              ></Icon>
              <Icon
                size="22"
                name="material-symbols:light-mode-outline"
                className="bg-slate-200"
                v-else="isDarkMode"
                class="h-[1.2rem] w-[1.2rem] transition-all"
              >
              </Icon>
            </UiButton>
            <DashboardUserNav />
          </div>
        </div>
      </div>

      <!-- Page Main Content -->
      <div
        class="space-y-10 md:space-y-0 p-5 shadow-none bg-secondary dark:bg-gray-900 dark:text-gray-100 md:p-8 pt-6"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<style scoped>
.router-link-active {
  @apply font-light text-primary dark:text-primary ml-1;
}
</style>
