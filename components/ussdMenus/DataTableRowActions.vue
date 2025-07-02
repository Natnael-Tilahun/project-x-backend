<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { useUssdMenus } from "~/composables/useUssdMenus";
import { PermissionConstants } from "~/constants/permissions";

const { deleteUssdMenu, isLoading } = useUssdMenus();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();

function viewUssdMenuDetail(id: string) {
  navigateTo(`/ussdMenus/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteUssdMenuHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteUssdMenu(id); // Call your API function to fetch roles
    console.log("Ussd menu deleted successfully");
    toast({
      title: "Ussd menu deleted successfully",
    });
    await props.refetch(); // Call refetch after successful deletion
    setOpenEditModal(false); // Close modal on success
  } catch (err) {
    console.error("Error deleting ussd menu:", err);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_USSD_MENU">
        <UiDropdownMenuItem @click="viewUssdMenuDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_USSD_MENU">
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem
          @click="setOpenEditModal(true)"
          class="text-red-600"
        >
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
          This action cannot be undone. This will permanently delete the ussd
          menu and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteUssdMenuHandler(row.original.id)">
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
