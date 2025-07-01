<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../../ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deleteContractUser } = useContractsUsers();

const loading = ref(false);
const isError = ref(false);
const openEditModal = ref(false);
const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<DataTableRowActionsProps<any>>();

async function deletingContractsUser(id: string) {
  try {
    loading.value = true;
    await deleteContractUser(id); // Call your API function to fetch roles
    console.log("Contract user deleted successfully");
    toast({
      title: "Contract user deleted successfully",
    });
    // Reload the window after deleting the role
    window.location.reload();
  } catch (err) {
    console.error("Error deleting contract user:", err);
    isError.value = true;
  } finally {
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
      <!-- <UiDropdownMenuItem @click="viewContractDetail(row.original.contractId)" -->
        <!-- > -->
        <UiPermissionGuard :permission="PermissionConstants.READ_CONTRACT_USER" >
        <UiAlertDialog>
          <UiAlertDialogTrigger class="px-2 text-sm">
            View & Edit
          </UiAlertDialogTrigger>
          <UiAlertDialogContent>
            <ContractsUsersDetails :id="row.original.id || ''"  />
          </UiAlertDialogContent>
        </UiAlertDialog>
        </UiPermissionGuard>
        <UiPermissionGuard :permission="PermissionConstants.DELETE_CONTRACT_USERS" >
      <UiDropdownMenuSeparator />
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
          contract user and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deletingContractsUser(row.original.id)">
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="loading"
            :disabled="loading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
