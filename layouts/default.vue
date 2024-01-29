<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Sidebar from "~/components/layout/sidebar/Sidebar.vue";
import OpenSidebarIcon from "~/components/layout/sidebar/OpenSidebarIcon.vue";
import CloseSidebarIcon from "~/components/layout/sidebar/CloseSidebarIcon.vue";

const LOCAL_STORAGE_THEME_KEY = "theme";

const route = useRoute();
const fullPath = ref(route.fullPath);
const pathSegments = ref([]);
pathSegments.value = splitPath(fullPath.value);

watch(
  () => route.fullPath,
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

// const colorMode = useColorMode(); // Set the initial color mode

// const setTheme = (newTheme: any) => {
//   localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
//   colorMode.value = newTheme;
// };

// const toggleTheme = () => {
//   // colorMode.value = colorMode.value === "light" ? "dark" : "light";
//   if (colorMode.value === "dark") {
//     colorMode.value = "light";
//     setTheme("light");
//     // document.body.classList.add("dark");
//   } else {
//     colorMode.value = "dark";
//     setTheme("dark");
//     // document.body.classList.remove("dark");
//   }
// };

// console.log("colorMode", colorMode.value);

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
    class="w-full min-h-screen bg-background grid grid-cols-12 lg:grid-cols-9 xl:grid-cols-7"
    :class="[
      {
        ' relative h-screen  w-full': !isSidebarCollapsed,
      },
      {
        ' static  w-full': isSidebarCollapsed,
      },
    ]"
  >
    <!-- ' hidden  border-4 border-white   md:backdrop md:w-[250px]' -->
    <!-- 'text-green-300 w-2/3  border-4 border-white z-50 absolute top-0 md:block  md:backdrop md:w-[250px] ' -->
    <!-- Page Sidebar -->
    <Sidebar
      class="md:col-span-3 col-span-12 md:static lg:col-span-2 xl:col-span-1"
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
      class="col-span-full md:col-span-9 bg-secondary lg:col-span-7 xl:col-span-6 md:flex"
      :class="[
        {
          'w-full   h-full top-0 left-0   flex-col md:flex':
            !isSidebarCollapsed,
        },
        {
          ' absolute  w-full h-full flex-col flex': isSidebarCollapsed,
        },
      ]"
    >
      <!-- Page Header -->
      <div class="border-b bg-background">
        <div class="flex h-16 items-center px-3 md:px-8">
          <!-- <DashboardMainNav class="mx-6" /> -->
          <div class="flex items-center gap-3 md:gap-2">
            <OpenSidebarIcon v-if="isSidebarCollapsed" @click="toggleSidebar" />
            <CloseSidebarIcon v-else @click="toggleSidebar" />
            <p class="text-lg font-thin hidden md:block space-x-2">
              <template v-if="pathSegments.length == 0">
                <router-link to="/">Dashboard</router-link>
              </template>
              <template v-if="pathSegments.length > 0">
                <span v-for="(segment, index) in pathSegments" :key="index">
                  <template v-if="index !== 0">
                    <Icon name="mdi:chevron-double-right" class=""></Icon>
                  </template>

                  <template v-if="segment">
                    <NuxtLink :to="generateLink(index)">
                      {{ capitalizeRouteName(segment) }}
                    </NuxtLink>
                  </template>
                </span>
              </template>
            </p>
          </div>

          <div class="ml-auto flex items-center space-x-2 md:space-x-10">
            <DashboardSearch />
            <!-- <div class="flex">
              <Icon
                name="tdesign:mode-dark"
                size="22"
                @click="toggleTheme"
                v-if="colorMode.value === 'dark'"
              ></Icon>
              <Icon
                size="22"
                name="material-symbols:light-mode-outline"
                @click="toggleTheme"
                v-else="colorMode.value === 'light'"
              >
              </Icon>
            </div> -->
            <DashboardUserNav />
          </div>
        </div>
      </div>

      <!-- Page Main Content -->
      <div class="space-y-10 p-5 bg-secondary md:p-8 pt-6">
        <slot />
      </div>
    </div>
  </div>
</template>
<style scoped>
.router-link-active {
  @apply font-light text-primary bg-popover ml-1;
}
</style>
