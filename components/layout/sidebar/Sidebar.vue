<template>
  <NuxtScrollbar
    tag="aside"
    class="bg-background text-sm text-secondary-foreground py-5 font-medium border-r shrink-0"
  >
    <div class="flex w-full items-center justify-between px-3">
      <h1
        class="lg:text-2xl text-xl font-black h-11 px-4 md:px-10 backdrop-blur-md text-primary self-center shadow-sm"
      >
        Project-X
      </h1>
      <Icon
        name="material-symbols:cancel"
        size="22"
        @click="closeMenuNav"
        class="md:hidden md:w-0"
      ></Icon>
    </div>

    <ul class="flex flex-col gap-4 p-5">
      <template v-for="(link, index) in mainLinks" :key="index">
        <UiCollapsible
          v-if="link.dropdown && link.dropdown.length > 0"
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
              <!-- <li> -->
              <NuxtLink
                v-for="(item, dropdownIndex) in link.dropdown"
                :key="dropdownIndex"
                :to="item.link"
                @click="closeMenuNav"
                class="w-full border-l-2 hover:rounded-r-lg group-hover:border-primary hover:bg-accent px-4 py-3 hover:text-primary"
                :class="{
                  'text-primary-foreground bg-primary rounded-lg font-bold': isRouteActive(item.link),
                }"
              >
                {{ item.title }}
              </NuxtLink>
              <!-- <UiSeparator class="mt-3 bg-zinc-300" /> -->
              <!-- </li> -->
            </ul>
          </UiCollapsibleContent>
        </UiCollapsible>

        <NuxtLink
          v-else
          :to="link.link"
          @click="closeMenuNav"
          :class="{
                  'text-primary-foreground bg-primary font-bold': isRouteActive(link?.link ?? ''),
                }"
          class="flex gap-3 py-3 px-2 hover:bg-popover hover:text-primary rounded-lg transition"
        >
          <span><Icon :name="link.icon" :size="link.size"></Icon></span>
          <p>{{ link.title }}</p>
        </NuxtLink>
      </template>
    </ul>
  </NuxtScrollbar>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const mainLinks = [
  {
    title: "Dashboard",
    icon: "ri:home-8-line",
    link: "/",
    size: "22",
    showDropdown: false,
  },
  // {
  //   title: "Alerts",
  //   icon: "ic:outline-wechat",
  //   link: "/alerts",
  //   size: "22",
  //   showDropdown: false,
  // },
  {
    title: "Role Management",
    icon: "solar:user-bold",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Roles", link: "/userRoles" },
      { title: "Permissions", link: "/userPermissions" },
      { title: "Permission Groups", link: "/permissionGroups" },
    ],
  },
  {
    title: "Customers",
    icon: "carbon:customer-service",
    size: "22",
    showDropdown: false,
    dropdown: [
      // { title: "Customers Roles", link: "/customerRoles" },
      { title: "Customers", link: "/customers" },
      // { title: "Permissions", link: "/permissions" },
    ],
  },
  {
    title: "Users",
    icon: "solar:user-bold",
    size: "22",
    showDropdown: false,
    dropdown: [
      // { title: "Customers Roles", link: "/customerRoles" },
      { title: "Users", link: "/users" },
      // { title: "Permissions", link: "/permissions" },
    ],
  },
  {
    title: "Staff Management",
    icon: "material-symbols:groups",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Staffs", link: "/staffs" },
      { title: "Offices", link: "/offices" },
      { title: "Staff Assignments", link: "/staffAssignments" },
    ],
  },
  // {
  //   title: "Employee Management",
  //   icon: "solar:user-bold",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "Users", link: "/users" },
  //     // { title: "Roles", link: "/userRoles" },
  //     // { title: "Permissions", link: "/userPermissions" },
  //   ],
  // },
  {
    title: "Merchants",
    icon: "material-symbols:partner-exchange-outline-rounded",
    link: "/merchants",
    size: "22",
    showDropdown: false,
  },
  // {
  //   title: "Api Integrations",
  //   icon: "material-symbols:partner-exchange-outline-rounded",
  //   link: "/integrations",
  //   size: "22",
  //   showDropdown: false,
  // },
  // {
  //   title: "Payment Integrations",
  //   icon: "material-symbols:payments",
  //   link: "/paymentIntegrations",
  //   size: "22",
  //   showDropdown: false,
  // },
  // {
  //   title: "Menu Categories",
  //   icon: "material-symbols:view-list",
  //   link: "/menuCategories",
  //   size: "22",
  //   showDropdown: false,
  // },
  {
    title: "Third Party Integrations",
    icon: "material-symbols:payments",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Api Integrations", link: "/integrations" },
      { title: "Payment Integrations", link: "/paymentIntegrations" },
      { title: "Menu Categories", link: "/menuCategories" },
      // { title: "Auth Configurations", link: "/authConfigurations" },
    ],
  },
  {
    title: "Application Management",
    icon: "material-symbols:phone-android",
    size: "22",
    showDropdown: false,
    dropdown: [{ title: "Applications", link: "/applications" }],
  },
  {
    title: "Contract Management",
    icon: "material-symbols:contract",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Contracts", link: "/contracts" },
    ],
  },
  {
    title: "Service Management",
    icon: "material-symbols:work",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Banking Services", link: "/bankingServices" },
      { title: "Service Definitions", link: "/serviceDefinitions" },
    ],
  },
  {
    title: "Application Content Management",
    icon: "material-symbols:create-new-folder",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "FAQs", link: "/applicationContentManagement/faqs" },
      {
        title: "Privacy Policies",
        link: "/applicationContentManagement/privacy-policies",
      },
      {
        title: "Term & Conditions",
        link: "/applicationContentManagement/term-conditions",
      },
      {
        title: "Service Outage Messages",
        link: "/applicationContentManagement/service-outage-messages",
      },
      { title: "Locations", link: "/applicationContentManagement/locations" },
      // {
      //   title: "Customer Care Informations",
      //   link: "/applicationContentManagement/customer-care-info",
      // },
      {
        title: "Ad Campaigns",
        link: "/applicationContentManagement/ad-campaigns",
      },
    ],
  },
  {
    title: "Logs & Reports",
    icon: "iconoir:reports-solid",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Logs", link: "/log" },
      // { title: "Reports", link: "/reports" },
    ],
  },
  // {
  //   title: "Master Data Management",
  //   icon: "icon-park-solid:category-management",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "Products", link: "/products" },
  //     { title: "Services", link: "/services" },
  //     { title: "Sequrity Questions", link: "/security-questions" },
  //   ],
  // },
  // {
  //   title: "Configurations",
  //   icon: "material-symbols:settings",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "System Configurations", link: "/system-configurations" },
  //     { title: "Business Configurations", link: "/business-configurations" },
  //   ],
  // },
  // {
  //   title: "Security & Authentication",
  //   icon: "material-symbols:shield-lock-outline-rounded",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "Credential Policy", link: "/credential-policy" },
  //     { title: "Password Settings", link: "/password-settings" },
  //     { title: "MFA Configurations", link: "/mfa-configurations" },
  //     { title: "MFA Scenarios", link: "/mfa-scenarios" },
  //   ],
  // },
  // {
  //   title: "Transactions",
  //   icon: "uil:transaction",
  //   // link: "/transactions",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "Transactions", link: "/transactions" },
  //     { title: "Dropdown Item 2", link: "/dropdown/item2" },
  //     // Add more dropdown items as needed
  //   ],
  // },
  // {
  //   title: "T24",
  //   icon: "streamline:computer-database-server-2-server-network-internet",
  //   link: "/t24",
  //   size: "22",
  //   showDropdown: false,
  // },
  // {
  //   title: "Anonymous",
  //   icon: "codicon:workspace-unknown",
  //   link: "/anonymous",
  //   size: "22",
  //   showDropdown: false,
  // },
  // {
  //   title: "Location Based Services",
  //   icon: "material-symbols:location-on",
  //   link: "/location-based-services",
  //   size: "22",
  //   showDropdown: false,
  // },
];

// Initialize isOpen array with the same length as mainLinks and set all to false
const isOpen = ref(new Array(mainLinks.length).fill(false));

const emits = defineEmits(["closeMenuNav"]); // Define custom event

const closeMenuNav = () => {
  emits("closeMenuNav"); // Emit the toggleTheme event to the parent
};

const route = useRoute();
// Function to check if route is active, including parent routes
function isRouteActive(path: string) {
  if (path === '/') {
    // For dashboard, only return true if we're exactly at the root
    return route.path === '/';
  }
  // For other routes, keep the existing behavior
  return route.path.startsWith(path);
}
</script>

<style scoped>
.router-link-active {
  @apply font-bold bg-primary rounded-lg text-primary-foreground;
}
</style>
