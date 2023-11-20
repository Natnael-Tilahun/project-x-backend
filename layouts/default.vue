<script lang="ts" setup>
import { ref, onMounted } from "vue";

const LOCAL_STORAGE_THEME_KEY = "theme";

const route = useRoute();
const capitalizeRouteName = (name: any) => {
  if (name) {
    return name && typeof name === "string"
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : "";
  }
  return "";
};

const colorMode = useColorMode(); // Set the initial color mode

const setTheme = (newTheme: any) => {
  localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  colorMode.value = newTheme;
};

const toggleTheme = () => {
  // colorMode.value = colorMode.value === "light" ? "dark" : "light";
  if (colorMode.value === "dark") {
    colorMode.value = "light";
    setTheme("light");
    // document.body.classList.add("dark");
  } else {
    colorMode.value = "dark";
    setTheme("dark");
    // document.body.classList.remove("dark");
  }
};

console.log("colorMode", colorMode.value);

const isSidebarCollapsed = useSidebarCollapsed();

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  console.log("isSidebarcollapsed : ", isSidebarCollapsed.value);
};

// onMounted(() => {
//   // const isDarkModePreferred = window.matchMedia(
//   //   "(prefers-color-scheme: dark)"
//   // ).matches;

//   const themeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);

//   if (themeFromLocalStorage) {
//     colorMode.value = themeFromLocalStorage;
//     // setTheme(themeFromLocalStorage);
//   }
//   // else {
//   //   colorMode.value = isDarkModePreferred ? "dark" : "light";
//   //   setTheme(isDarkModePreferred ? "dark" : "light");
//   // }
// });
</script>

<template>
  <div
    class="flex w-full min-h-screen bg-background"
    :class="{
      root: colorMode.value == 'light',
      dark: colorMode.value == 'dark',
    }"
  >
    <!-- Page Sidebar -->
    <Sidebar class="" :style="{ width: isSidebarCollapsed ? '0' : '250px' }" />

    <!-- <div class="md:hidden">
      <VPImage
        alt="Dashboard"
        width="1280"
        height="1214"
        class="block"
        :image="{
          dark: '/examples/dashboard-dark.png',
          light: '/examples/dashboard-light.png',
        }"
      />
    </div> -->

    <div class="hidden md:basis-full flex-col md:flex">
      <!-- Page Header -->
      <div class="border-b">
        <div class="flex h-16 items-center px-8">
          <!-- <DashboardMainNav class="mx-6" /> -->
          <div class="flex items-center gap-5">
            <OpenSidebarIcon v-if="isSidebarCollapsed" @click="toggleSidebar" />
            <CloseSidebarIcon v-else @click="toggleSidebar" />
            <p class="text-lg font-medium">
              {{
                route.path === "/"
                  ? "Dashboard"
                  : capitalizeRouteName(route.name)
              }}
            </p>
          </div>

          <div class="ml-auto flex items-center space-x-10">
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
      <div class="space-y-10 p-8 pt-6">
        <slot />
      </div>
    </div>
  </div>
</template>
