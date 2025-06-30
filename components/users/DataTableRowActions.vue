<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deleteUserById, isLoading } = useUsers();
const loading = ref(isLoading.value);
const isError = ref(false);
const openDeleteModal = ref(false);
const setOpenDeleteModal = (value: boolean) => {
  openDeleteModal.value = value;
};

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['systemUsersDeleted', 'editSystemUser']); // Added 'languageDeleted'

function viewUserDetail(id: string) {
  navigateTo(`/users/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteUser(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteUserById(id); // Call your API function to fetch roles
    console.log("User deleted successfully");
    toast({
      title: "User deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting users:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenDeleteModal(false);
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
      <UiPermissionGuard :permission=PermissionConstants.READ_USER >
      <UiDropdownMenuItem @click="viewUserDetail(row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
    </UiPermissionGuard>
      <UiPermissionGuard :permission=PermissionConstants.DELETE_USER >
      <UiDropdownMenuItem @click="setOpenDeleteModal(true)" class="text-red-600">
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
    </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openDeleteModal" :onOpenChange="setOpenDeleteModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          user and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeleteModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteUser(row.original.id)">
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
