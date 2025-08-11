import type { MenuItem } from "~/types";
import { PermissionConstants } from "./permissions";

export const mainLinks: MenuItem[] = [
    {
      title: "Dashboard",
      icon: "ri:home-8-line",
      link: "/",
      size: "22",
      showDropdown: false,
      // permission: "VIEW_DASHBOARD",
    },
    {
      title: "Role Management",
      icon: "solar:user-bold",
      size: "22",
      showDropdown: true,
      dropdown: [
        { title: "System Roles", link: "/userRoles", permission: PermissionConstants.READ_ROLE },
        { title: "Staff Roles", link: "/staffRoles", permission: PermissionConstants.READ_STAFF_ROLE},
        { title: "Merchant Roles", link: "/merchantRoles", permission: PermissionConstants.READ_MERCHANT_OPERATOR_ROLE},
        {
          title: "Permissions",
          link: "/userPermissions",
          permission: PermissionConstants.READ_PERMISSION,
        },
        {
          title: "Permission Groups",
          link: "/permissionGroups",
          permission: PermissionConstants.READ_PERMISSION_GROUP,
        },
      ],
    },
    {
      title: "Customers",
      icon: "carbon:customer-service",
      size: "22",
      showDropdown: false,
      dropdown: [
        { title: "Customers", link: "/customers", permission: PermissionConstants.READ_CUSTOMER },
        { title: "Customer Groups", link: "/customerGroups", permission: PermissionConstants.READ_CUSTOMER },
        { title: "Customer Group Members", link: "/customerGroupMembers", permission: PermissionConstants.READ_CUSTOMER },
      ],
    },
    {
      title: "System Users",
      icon: "solar:user-bold",
      size: "22",
      showDropdown: false,
      dropdown: [
        { title: "System Users", link: "/users", permission: PermissionConstants.READ_USER },
      ],
    },
    {
      title: "Staff Management",
      icon: "material-symbols:groups",
      size: "22",
      showDropdown: false,
      dropdown: [
        { title: "Staffs", link: "/staffs", permission: PermissionConstants.READ_STAFF },
        { title: "Offices", link: "/offices", permission: PermissionConstants.READ_OFFICE },
        // {
        //   title: "Staff Assignments",
        //   link: "/staffAssignments",
        //   permission: "VIEW_STAFF_ASSIGNMENTS",
        // },
      ],
    },
    {
      title: "Merchants",
      icon: "material-symbols:partner-exchange-outline-rounded",
      link: "/merchants",
      size: "22",
      permission: PermissionConstants.READ_MERCHANT,
      showDropdown: true,
    },
    {
      title: "Third Party Integrations",
      icon: "material-symbols:payments",
      size: "22",
      showDropdown: false,
      dropdown: [
        {
          title: "Api Integrations",
          link: "/integrations",
          permission: PermissionConstants.READ_API_INTEGRATION,
        },
        {
          title: "Payment Integrations",
          link: "/paymentIntegrations",
          permission: PermissionConstants.READ_PAYMENT_INTEGRATION,
        },
        {
          title: "Menu Categories",
          link: "/menuCategories",
          permission: PermissionConstants.READ_INTEGRATION_MENU,
        },
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
          permission: PermissionConstants.READ_APPLICATION,
        },
      ],
    },
    {
      title: "Contract Management",
      icon: "material-symbols:contract",
      size: "22",
      showDropdown: false,
      dropdown: [
        { title: "Contracts", link: "/contracts", permission: PermissionConstants.READ_CONTRACT },
      ],
    },
    {
      title: "Charges",
      icon: "material-symbols:money-off",
      link: "/charges",
      size: "22",
      permission: PermissionConstants.READ_CHARGE,
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
          permission: PermissionConstants.READ_BANKING_SERVICE,
        },
        {
          title: "Service Definitions",
          link: "/serviceDefinitions",
          permission: PermissionConstants.READ_SERVICE_DEFINITION,
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
          permission: PermissionConstants.READ_USSD_LANGUAGE,
        },
        {
          title: "USSD Default Messages",
          link: "/ussdDefaultMessages",
          permission: PermissionConstants.READ_USSD_DEFAULT_MESSAGE,
        },
        {
          title: "USSD Localized Default Messages",
          link: "/ussdLocalizedMessages",
          permission: PermissionConstants.READ_USSD_LOCALIZED_DEFAULT_MESSAGE,
        },
        {
          title: "USSD Menus",
          link: "/ussdMenus",
          permission: PermissionConstants.READ_USSD_MENU,
        },
        {
          title: "USSD Localized Menus",
          link: "/ussdLocalizedMenus",
          permission: PermissionConstants.READ_USSD_LOCALIZED_MENU,
        },
        {
          title: "Ussd Menus Cache Management",
          link: "/ussdMenusCacheManagement",
          permission: PermissionConstants.READ_USSD_MENU_CACHE_MANAGEMENT,
        },
      ],
    },
    {
      title: "Logs & Health Reports",
      icon: "iconoir:reports-solid",
      size: "22",
      showDropdown: false,
      dropdown: [
        // { title: "Logs", link: "/logs", permission: PermissionConstants.READ_ADMIN_CONSOLE_LOG },
        { title: "Logs", link: "/logs", permission:PermissionConstants.READ_ADMIN_CONSOLE_LOG},
        { title: "Health", link: "/health", permission:""},
        { title: "Api", link: "/docs", permission:""},
        { title: "Configuration", link: "/configuration", permission:""}
          // permission: PermissionConstants.READ_HEALTH        // { title: "Reports", link: "/reports" },
      ],
    },
  ];