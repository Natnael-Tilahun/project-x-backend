<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deleteStaffAssignment, terminateAssignmentsFromStaffs, isLoading } =
  useStaffAssignments();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const openEditTeminationModal = ref(false);

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const setOpenEditTerminationModal = (value: boolean) => {
  openEditTeminationModal.value = value;
};

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['staffAssignmentsDeleted', 'editStaffAssignment']); // Added 'languageDeleted'

function viewStaffAssignmentDetail(id: string) {
  navigateTo(`/staffAssignments/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteStaffAssignments(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteStaffAssignment(id); // Call your API function to fetch roles
    console.log("Staff assignment deleted successfully");
    toast({
      title: "Staff assignment deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting staff assignment:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
}

async function terminateStaffAssignments(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await terminateAssignmentsFromStaffs(id); // Call your API function to fetch roles
    console.log("Assignment terminated for all staffs successfully");
    toast({
      title: "Assignment terminated successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error terminating assignment:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditTerminationModal(false);
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
        <UiDropdownMenuItem @click="viewStaffAssignmentDetail(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <!-- <UiPermissionGuard permission="VIEW_STAFF_ASSIGNMENTS" > -->
      <UiDropdownMenuItem @click="setOpenEditTerminationModal(true)"
        >Terminate Assignments</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      <!-- </UiPermissionGuard> -->
      <UiPermissionGuard :permission="PermissionConstants.DELETE_STAFF_ASSIGNMENTS">
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
          This action cannot be undone. This will permanently delete the staff
          assignment and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteStaffAssignments(row.original.id)">
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

  <UiAlertDialog
    :open="openEditTeminationModal"
    :onOpenChange="setOpenEditTerminationModal"
  >
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently terminate the
          staff assignment and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditTerminationModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="terminateStaffAssignments(row.original.id)"
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
