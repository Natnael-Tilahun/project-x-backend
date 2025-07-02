<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";

const { deleteRoleById, getRoles, isLoading } = useRoles();
const loading = ref(isLoading.value);
const isError = ref(false);
const { setIsUpdated } = usePagesInfoStore();
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refetch: () => Promise<void>; // Accept refetch as a prop
}
const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['systemRoleDeleted', 'editSystemRole']); // Added 'languageDeleted'

function viewRollDetails(name: string) {
  navigateTo(`/userRoles/${name}`);
  navigator.clipboard.writeText(name);
}

async function deleteRole(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteRoleById(id); // Call your API function to fetch roles
    console.log("Role deleted successfully");
    toast({
      title: "Role deleted successfully",
    });
    setIsUpdated({ isUpdated: true });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting role:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
}
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Icon name="majesticons:dots-horizontal" class="h-4 w-4"></Icon>
        <span class="sr-only">Open menu</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end" class="w-[160px]">
      <UiPermissionGuard :permission="PermissionConstants.READ_ROLE" >
      <UiDropdownMenuItem @click="viewRollDetails(row.original.name)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_ROLE" >
      <UiDropdownMenuItem @click="setOpenEditModal(true)" class="text-red-500">
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the system role
          and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteRole(row.original.name)">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            :disabled="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
