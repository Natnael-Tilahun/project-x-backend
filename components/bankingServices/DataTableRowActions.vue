<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";

const { deleteBankingService, isLoading } = useBankingServices();

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(["bankingServiceDeleted"]);

const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
// const props = defineProps<DataTableRowActionsProps<any>>();

function viewBankingServiceDetail(id: string) {
  navigateTo(`/bankingServices/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteBankingServices(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteBankingService(id); // Call your API function to fetch roles
    console.log("Banking service deleted successfully");
    toast({
      title: "Banking service deleted successfully",
    });
    // Reload the window after deleting the role
    // window.location.reload();
    await props.refetch(); // Call refetch after successful deletion
    setOpenEditModal(false);
  } catch (err) {
    console.error("Error deleting banking service:", err);
    isError.value = true;
    setOpenEditModal(false);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_BANKING_SERVICE">
        <UiDropdownMenuItem @click="viewBankingServiceDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_BANKING_SERVICE">
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
          This action cannot be undone. This will permanently delete the banking
          service and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteBankingServices(row.original.id)">
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
