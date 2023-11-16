<script lang="ts" setup>
const route = useRoute();
const capitalizeRouteName = (name: any) => {
  if (name) {
    return name && typeof name === "string"
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : "";
  }
  return "";
};

const isSidebarCollapsed = useSidebarCollapsed();

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  console.log("isSidebarcollapsed : ", isSidebarCollapsed.value);
};
</script>

<template>
  <div class="flex w-full min-h-screen bg-background">
    <!-- Page Sidebar -->
    <Sidebar :style="{ width: isSidebarCollapsed ? '0' : '250px' }" />

    <div class="md:hidden">
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
    </div>

    <div class="hidden flex-col md:flex md:flex-1">
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

          <div class="ml-auto flex items-center space-x-4">
            <DashboardSearch />
            <DashboardUserNav />
          </div>
        </div>
      </div>

      <!-- Page Main Content -->
      <div class="flex-1 space-y-10 p-8 pt-6">
        <slot />
      </div>
    </div>
  </div>
</template>
