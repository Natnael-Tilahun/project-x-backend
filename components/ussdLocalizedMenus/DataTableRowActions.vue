<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { useUssdLocalizedMenus } from "~/composables/useUssdLocalizedMenus";
const { deleteUssdLocalizedMenu, isLoading } = useUssdLocalizedMenus();
const loading = ref(isLoading.value);
const isError = ref(false);
const openDeleteConfirmModal = ref(false);
const setOpenDeleteConfirmModal = (value: boolean) => {
  openDeleteConfirmModal.value = value;
};

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

function viewUssdLocalizedDefaultMessageDetail(id: string) {
  console.log("id: ", id);
  navigateTo(`/ussdLocalizedMessages/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteUssdLocalizedMenuHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteUssdLocalizedMenu(id);
    console.log("Ussd localized menu deleted successfully");
    toast({
      title: "Ussd localized menu deleted successfully",
      variant: "default"
    });
    setOpenDeleteConfirmModal(false); // Close modal first
    await props.refetch(); // Then refetch data
  } catch (err) {
    console.error("Error deleting ussd localized menu:", err);
    toast({
      title: "Error deleting USSD localized menu",
      description: (err as Error)?.message || "An unexpected error occurred.",
      variant: "destructive"
    });
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
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
      <UiPermissionGuard permission="VIEW_USSD_LOCALIZED_MENUS">
        <UiDropdownMenuItem
          @click="viewUssdLocalizedDefaultMessageDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
      </UiPermissionGuard>
      <UiPermissionGuard permission="DELETE_USSD_LOCALIZED_MENUS">
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem
          @click="setOpenDeleteConfirmModal(true)"
          class="text-red-600"
        >
          Delete
          <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openDeleteConfirmModal" :onOpenChange="setOpenDeleteConfirmModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the ussd
          localized menu and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeleteConfirmModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deleteUssdLocalizedMenuHandler(row.original.id)"
          :disabled="isLoading"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
