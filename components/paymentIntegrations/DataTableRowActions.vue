<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { usePaymentIntegrations } from "~/composables/usePaymentIntegrations";
import { PermissionConstants } from "~/constants/permissions";
const { deletePaymentIntegration, exportPaymentIntegration, isLoading } = usePaymentIntegrations();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const openExportModal = ref(false);

const setOpenExportModal = (value: boolean) => {
  openExportModal.value = value;
};
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
const emit = defineEmits(['paymentIntegrationDeleted', 'editPaymentIntegration']); // Added 'languageDeleted'

function viewPaymentIntegrationDetail(id: string) {
  navigateTo(`/paymentIntegrations/${id}`);
  navigator.clipboard.writeText(id);
}

async function deletePaymentIntegrationHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deletePaymentIntegration(id); // Call your API function to fetch roles
    console.log("Payment Integration deleted successfully");
    toast({
      title: "Payment Integration deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting payment integrations:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
}

async function exportIntegrationHandler(id: string) {

  try {
    isLoading.value = true;
    loading.value = true;
    const data = await exportPaymentIntegration(id); // Get the JSON data
    console.log("Payment Integration exported successfully");
    toast({
      title: "Payment Integration exported successfully",
    });

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${data?.data[0]?.integrationName	}_payment_integration_${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    await props.refetch(); // Call refetch after successful export
  } catch (err) {
    console.error("Error exporting payment integration:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenExportModal(false);
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
  <UiPermissionGuard :permission="PermissionConstants.READ_PAYMENT_INTEGRATION" >
      <UiDropdownMenuItem @click="viewPaymentIntegrationDetail(row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      </UiPermissionGuard>
           <UiPermissionGuard :permission="PermissionConstants.EXPORT_PAYMENT_INTEGRATION" >
            <UiDropdownMenuItem  @click="setOpenExportModal(true)"
        >Export Payment Integration</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
    </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.DELETE_PAYMENT_INTEGRATION" >
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
          integration and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deletePaymentIntegrationHandler(row.original.id)"
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


  <UiAlertDialog :open="openExportModal" :onOpenChange="setOpenExportModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. It will export this
          payment integration data and download it to your file system.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenExportModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="exportIntegrationHandler(row.original.id)">
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
