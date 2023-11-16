<template>
  <NuxtScrollbar
    tag="aside"
    class="h-screen hidden md:block py-5 md:w-64 font-medium border-r border-zinc-300 shrink-0 fixed"
  >
    <h1
      class="text-2xl font-bold h-11 px-10 backdrop-blur-md self-center shadow-sm"
    >
      Project X
    </h1>
    <ul class="flex flex-col gap-5 p-5">
      <NuxtLink
        :to="link.link"
        v-for="link in mainLinks"
        :key="link.title"
        class="flex gap-4 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
      >
        <span><Icon :name="link.icon" :size="link.size"></Icon></span>
        <p>{{ link.title }}</p>
      </NuxtLink>
    </ul>
  </NuxtScrollbar>
</template>

<script lang="ts" setup>
const mainLinks = [
  {
    title: "Dashboard",
    icon: "ri:home-8-line",
    link: "/",
    size: "22",
  },
  { title: "Users", icon: "solar:user-bold", link: "users", size: "22" },
  {
    title: "Transactions",
    icon: "uil:transaction",
    link: "/transactions",
    size: "22",
  },
  {
    title: "Merchants",
    icon: "material-symbols:partner-exchange-outline-rounded",
    link: "/merchants",
    size: "22",
  },
  {
    title: "T24",
    icon: "streamline:computer-database-server-2-server-network-internet",
    link: "/t24",
    size: "22",
  },
  {
    title: "Customers",
    icon: "carbon:customer-service",
    link: "/customers",
    size: "22",
  },
  {
    title: "Notifications",
    icon: "material-symbols:circle-notifications",
    link: "/notifications",
    size: "22",
  },
  {
    title: "Anonymous",
    icon: "codicon:workspace-unknown",
    link: "/anonymous",
    size: "22",
  },
  {
    title: "Location Based Services",
    icon: "material-symbols:location-on",
    link: "/location-based-services",
    size: "22",
  },
  {
    title: "Reporting",
    icon: "uil:transaction",
    link: "/reporting",
    size: "22",
  },
  {
    title: "Setting",
    icon: "iconoir:reports-solid",
    link: "/settings",
    size: "22",
  },
];
</script>
