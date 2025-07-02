<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";

const { deleteChargeRuleById, isLoading } = useCharges();
const { setIsUpdated } = usePagesInfoStore();
const route = useRoute();

const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const chargeId = ref<string>("");
chargeId.value = route.params.id as string;
const chargeRuleId = ref<string>("");

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refetch: () => Promise<void>; // Accept refetch as a prop
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['chargeRuleDeleted', 'editChargeRules']); // Added 'languageDeleted'

function viewApplicationDetails(id: string) {
  navigateTo(
    `/charges/${chargeId.value}?activeTab=chargeRuleDetails&&chargeRuleId=${id}`
  );
}

async function deleteChargeRule(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteChargeRuleById(id); // Call your API function to fetch roles
    console.log("Charge rule deleted successfully");
    toast({
      title: "Charge rule deleted successfully",
    });
    setIsUpdated({ isUpdated: true });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting the charge rule:", err);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_CHARGE_RULE">
        <UiDropdownMenuItem @click="viewApplicationDetails(row.original.id)"
          >View and Edit</UiDropdownMenuItem
        >
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_CHARGE_RULE">
        <UiDropdownMenuItem
          @click="setOpenEditModal(true)"
          class="text-red-500"
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
          This action cannot be undone. This will permanently delete the charge
          rule and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteChargeRule(row.original.id)">
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
