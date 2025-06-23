<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { useMenus } from "~/composables/useMenus";
const { deleteMenu, exportMenus, isLoading } = useMenus();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const openExportModal = ref(false);

const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};
const setOpenExportModal = (value: boolean) => {
  openExportModal.value = value;
};

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(['menuDeleted', 'editMenu']); // Added 'languageDeleted'

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

function viewMenuDetail(id: string) {
  console.log("id: ", id);
  navigateTo(`/menuCategories/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteMenuHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteMenu(id); // Call your API function to fetch roles
    console.log("Menu deleted successfully");
    toast({
      title: "Menu deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting menu:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
}

async function exportMenusHandler(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    const data = await exportMenus(id); // Get the JSON data
    console.log("Menu exported successfully");
    toast({
      title: "Menus exported successfully",
    });

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${data?.data[0]?.name}_menu_${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    await props.refetch(); // Call refetch after successful export
  } catch (err) {
    console.error("Error exporting integration:", err);
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
  <UiPermissionGuard permission="VIEW_INTEGRATION_MENUS" >
      <UiDropdownMenuItem @click="viewMenuDetail(row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
      </UiPermissionGuard>
           <!-- <UiPermissionGuard permission="EXPORT_API_INTEGRATIONS" > -->
            <UiDropdownMenuItem  @click="setOpenExportModal(true)"
        >Export Menu</UiDropdownMenuItem
      >
      <UiDropdownMenuSeparator />
    <!-- </UiPermissionGuard> -->
  <UiPermissionGuard permission="DELETE_INTEGRATION_MENUS" >
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
          This action cannot be undone. This will permanently delete the menu
          and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="deleteMenuHandler(row.original.id)">
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
          menu data and download it to your file system.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenExportModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="exportMenusHandler(row.original.id)">
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
