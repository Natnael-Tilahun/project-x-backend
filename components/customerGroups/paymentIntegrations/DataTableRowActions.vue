<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
const { deletePaymentIntegrationsFromTheGroup, isLoading } =
  useCustomerGroups();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const integrationsIds = ref<string[]>([])
const groupId = ref<string>("")
groupId.value = getIdFromPath()

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
const emit = defineEmits(['groupMemberDeleted']); // Added 'languageDeleted'

function viewGroupDetail(id: string) {
  navigateTo(`/customerGroups/${groupId.value}?activeTab=integrationDetails/${id}&memberId=${id}`);
  navigator.clipboard.writeText(id);
}

async function deletegroupMembers(id: string, customerId:string) {
  try {
    isLoading.value = true;
    loading.value = true;
    integrationsIds.value.push(customerId)
    const newValues ={
      integrationsIds: integrationsIds.value
    }
    await deletePaymentIntegrationsFromTheGroup(id, newValues); // Call your API function to fetch roles
    console.log("Group member deleted successfully");
    toast({
      title: "Group member deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting group member:", err);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_STAFF_ASSIGNMENT">
        <UiDropdownMenuItem @click="viewGroupDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_STAFF_ASSIGNMENT">
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
          This action cannot be undone. This will permanently delete payment integration from the group and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deletegroupMembers(row.original.id, row.original.integration.id)">
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
