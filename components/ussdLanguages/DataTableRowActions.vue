<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { useUssdLanguages } from "~/composables/useUssdLanguages";
import { PermissionConstants } from "~/constants/permissions";

const { deleteUssdLanguage, isLoading: composableIsLoading } = useUssdLanguages(); // Renamed to avoid conflict
const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['languageDeleted', 'editLanguage']); // Added 'languageDeleted'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const localIsLoading = ref(false); // Local loading state for the delete button
const isError = ref(false);
const openDeleteConfirmModal = ref(false); // Renamed for clarity

const setOpenDeleteConfirmModal = (value: boolean) => {
  openDeleteConfirmModal.value = value;
};

// const route = useRoute(); // Not used in this snippet, can be removed if not needed elsewhere

function viewUssdLanguageDetail(id: string) {
  console.log("id: ", id);
  navigateTo(`/ussdLanguages/${id}`);
  // navigator.clipboard.writeText(id); // Optional
}

async function deleteUssdLanguageHandler(id: string) {
  try {
    localIsLoading.value = true;
    isError.value = false; // Reset error state
    await deleteUssdLanguage(id);
    console.log("Ussd language deleted successfully");
    toast({
      title: "Ussd language deleted successfully",
      variant: "default", // Changed from "success" to "default"
    });
    await props.refetch(); // Call refetch after successful deletion
    setOpenDeleteConfirmModal(false); // Close modal on success
  } catch (err) {
    console.error("Error deleting ussd language:", err);
    toast({
      title: "Error deleting USSD language",
      description: (err as Error)?.message || "An unexpected error occurred.",
      variant: "destructive",
    });
    isError.value = true;
  } finally {
    localIsLoading.value = false;
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
      <UiPermissionGuard :permission="PermissionConstants.READ_USSD_LANGUAGE">
        <UiDropdownMenuItem @click="viewUssdLanguageDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_USSD_LANGUAGES">
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
          language and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenDeleteConfirmModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deleteUssdLanguageHandler(row.original.id)"
          :disabled="localIsLoading"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="localIsLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>