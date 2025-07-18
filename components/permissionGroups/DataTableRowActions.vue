<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deletePermissionGroupById, isLoading } = usePermissionGroups();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['permissionGroupDeleted']); // Added 'languageDeleted'

function viewPermissionGroupDetail(id: string) {
  navigateTo(`/permissionGroups/${id}`);
  navigator.clipboard.writeText(id);
}

async function deletePermissionGroup(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deletePermissionGroupById(id); // Call your API function to fetch roles
    console.log("Permission group deleted successfully");
    toast({
      title: "Permission group deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch()
  } catch (err) {
    console.error("Error deleting permission group:", err);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_PERMISSION_GROUP" >
      <UiDropdownMenuItem @click="viewPermissionGroupDetail(row.original.groupCode)"
        >View</UiDropdownMenuItem
      >
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.UPDATE_PERMISSION_GROUP" >
      <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
      </UiPermissionGuard>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuSeparator />
      <UiPermissionGuard :permission="PermissionConstants.DELETE_PERMISSION_GROUP" >
      <UiDropdownMenuItem @click="setOpenEditModal(true)" class="text-red-600">
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
          This action cannot be undone. This will permanently delete the
          permission group and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deletePermissionGroup(row.original.groupCode)">
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
