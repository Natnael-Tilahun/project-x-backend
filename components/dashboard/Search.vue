<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { MenuItem, SearchResult } from '~/types';

const searchQuery = ref('');
const router = useRouter();

// Define the mainLinks array
const mainLinks: MenuItem[] = [
  {
    title: "Dashboard",
    icon: "ri:home-8-line",
    link: "/",
    size: "22",
    showDropdown: false,
    // permission: "VIEW_DASHBOARD",
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
    showDropdown: true,
    dropdown: [
      { title: "System Roles", link: "/userRoles", permission: "VIEW_ROLES_LIST" },
      { title: "Staff Roles", link: "/staffRoles", permission: "VIEW_ROLES_LIST" },
      {
        title: "Permissions",
        link: "/userPermissions",
        permission: "VIEW_PERMISSIONS",
      },
      {
        title: "Permission Groups",
        link: "/permissionGroups",
        permission: "VIEW_PERMISSION_GROUPS",
      },
    ],
  },
  {
    title: "Customers",
    icon: "carbon:customer-service",
    size: "22",
    showDropdown: false,
    dropdown: [
      // { title: "Customers Roles", link: "/customerRoles" },
      { title: "Customers", link: "/customers", permission: "VIEW_CUSTOMERS" },
      // { title: "Permissions", link: "/permissions" },
    ],
  },
  {
    title: "System Users",
    icon: "solar:user-bold",
    size: "22",
    showDropdown: false,
    dropdown: [
      // { title: "Customers Roles", link: "/customerRoles" },
      { title: "System Users", link: "/users", permission: "VIEW_USERS" },
      // { title: "Permissions", link: "/permissions" },
    ],
  },
  {
    title: "Staff Management",
    icon: "material-symbols:groups",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Staffs", link: "/staffs", permission: "VIEW_STAFF" },
      { title: "Offices", link: "/offices", permission: "VIEW_OFFICES" },
      {
        title: "Staff Assignments",
        link: "/staffAssignments",
        permission: "VIEW_STAFF_ASSIGNMENTS",
      },
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
    permission: "VIEW_MERCHANTS",
    showDropdown: true,
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
      {
        title: "Api Integrations",
        link: "/integrations",
        permission: "VIEW_API_INTEGRATIONS",
      },
      {
        title: "Payment Integrations",
        link: "/paymentIntegrations",
        permission: "VIEW_PAYMENT_INTEGRATIONS",
      },
      {
        title: "Menu Categories",
        link: "/menuCategories",
        permission: "VIEW_INTEGRATION_MENUS",
      },
      // { title: "Auth Configurations", link: "/authConfigurations" },
    ],
  },
  {
    title: "Application Management",
    icon: "material-symbols:phone-android",
    size: "22",
    showDropdown: false,
    dropdown: [
      {
        title: "Applications",
        link: "/applications",
        permission: "VIEW_APPLICATIONS",
      },
    ],
  },
  {
    title: "Contract Management",
    icon: "material-symbols:contract",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Contracts", link: "/contracts", permission: "VIEW_CONTRACTS" },
    ],
  },
  {
    title: "Charges",
    icon: "material-symbols:money-off",
    link: "/charges",
    size: "22",
    permission: "VIEW_CHARGES",
    showDropdown: true,
  },
  {
    title: "Service Management",
    icon: "material-symbols:work",
    size: "22",
    showDropdown: false,
    dropdown: [
      {
        title: "Banking Services",
        link: "/bankingServices",
        permission: "VIEW_BANKING_SERVICES",
      },
      {
        title: "Service Definitions",
        link: "/serviceDefinitions",
        permission: "VIEW_SERVICE_DEFINITIONS",
      },
    ],
  },
  {
    title: "USSD Management",
    icon: "material-symbols:phone-android",
    size: "22",
    showDropdown: false,
    dropdown: [
      {
        title: "USSD Languages",
        link: "/ussdLanguages",
        permission: "VIEW_USSD_LANGUAGES",
      },
      {
        title: "USSD Default Messages",
        link: "/ussdDefaultMessages",
        permission: "VIEW_USSD_DEFAULT_MESSAGES",
      },
      {
        title: "USSD Localized Default Messages",
        link: "/ussdLocalizedMessages",
        permission: "VIEW_USSD_LOCALIZED_DEFAULT_MESSAGES",
      },
      {
        title: "USSD Menus",
        link: "/ussdMenus",
        permission: "VIEW_USSD_MENUS",
      },
      {
        title: "USSD Localized Menus",
        link: "/ussdLocalizedMenus",
        permission: "VIEW_USSD_LOCALIZED_MENUS",
      },
      {
        title: "Ussd Menus Cache Management",
        link: "/ussdMenusCacheManagement",
        permission: "VIEW_USSD_MENU_CACHE_MANAGEMENT",
      },
    ],
  },
  // {
  //   title: "Application Content Management",
  //   icon: "material-symbols:create-new-folder",
  //   size: "22",
  //   showDropdown: false,
  //   dropdown: [
  //     { title: "FAQs", link: "/applicationContentManagement/faqs" },
  //     {
  //       title: "Privacy Policies",
  //       link: "/applicationContentManagement/privacy-policies",
  //     },
  //     {
  //       title: "Term & Conditions",
  //       link: "/applicationContentManagement/term-conditions",
  //     },
  //     {
  //       title: "Service Outage Messages",
  //       link: "/applicationContentManagement/service-outage-messages",
  //     },
  //     { title: "Locations", link: "/applicationContentManagement/locations" },
  //     // {
  //     //   title: "Customer Care Informations",
  //     //   link: "/applicationContentManagement/customer-care-info",
  //     // },
  //     {
  //       title: "Ad Campaigns",
  //       link: "/applicationContentManagement/ad-campaigns",
  //     },
  //   ],
  // },
  {
    title: "Logs & Reports",
    icon: "iconoir:reports-solid",
    size: "22",
    showDropdown: false,
    dropdown: [
      { title: "Logs", link: "/logs", permission: "VIEW_AUDIT_LOGS" },
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
        isMainMenu: true
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
            parentMenu: link.title
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
