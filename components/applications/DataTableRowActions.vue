<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
import { toast } from "../ui/toast";
const { deleteApplicationById, getApplications, isLoading } = useApplications();
const loading = ref(isLoading.value);
const isError = ref(false);
const { setIsUpdated } = usePagesInfoStore();
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refetch: () => Promise<void>; // Accept refetch as a prop
}
const props = defineProps<DataTableRowActionsProps<any>>();

function viewApplicationDetails(id: string) {
  navigateTo(`/applications/${id}`);
}

async function deleteApplication(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteApplicationById(id); // Call your API function to fetch roles
    toast({
      title: "Application deleted successfully",
    });
    setIsUpdated({ isUpdated: true });
    // Reload the window after deleting the role
    window.location.reload();
  } catch (err) {
    console.error("Error deleting application:", err);
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
      <UiDropdownMenuItem @click="viewApplicationDetails(row.original.id)"
        >View</UiDropdownMenuItem
      >
      <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
      <UiDropdownMenuItem>Deactivate</UiDropdownMenuItem>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem @click="setOpenEditModal(true)" class="text-red-500">
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          application and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteApplication(row.original.id)">
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
