<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { usePaymentOperations } from "~/composables/usePaymentOperations";
import { PermissionConstants } from "~/constants/permissions";
const { deletePaymentOperation, isLoading } = usePaymentOperations();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['operationDeleted', 'editOperation']); // Added 'languageDeleted'

function viewIntegrationDetail(id: string) {
  navigateTo({
    path: route.path,
    query: {
      activeTab: "configurePaymentOperations",
      operationId: id,
    },
  });
  navigator.clipboard.writeText(id);
}

async function deletePaymentOperationHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deletePaymentOperation(id); // Call your API function to fetch roles
    console.log("Payment Operation deleted successfully");
    toast({
      title: "Payment Operation deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting payment operations:", err);
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
<UiPermissionGuard :permission="PermissionConstants.READ_PAYMENT_OPERATION" >
      <UiDropdownMenuItem @click="viewIntegrationDetail(row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      </UiPermissionGuard>
<UiPermissionGuard :permission="PermissionConstants.DELETE_PAYMENT_OPERATION" >
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
          This action cannot be undone. This will permanently delete the payment
          operation and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deletePaymentOperationHandler(row.original.id)"
        >
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
