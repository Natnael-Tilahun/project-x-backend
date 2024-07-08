<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
const { deleteMerchant, isLoading } = useMerchants();
const loading = ref(isLoading.value);
const isError = ref(false);

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<DataTableRowActionsProps<any>>();

function viewCustomerDetail(id: string) {
  navigateTo(`/merchants/merchantDetails/${id}`);
  navigator.clipboard.writeText(id);
}

async function deleteMerchants(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteMerchant(id); // Call your API function to fetch roles
    console.log("Merchant deleted successfully");
    toast({
      title: "Merchant deleted successfully",
    });
    // Reload the window after deleting the role
    window.location.reload();
  } catch (err) {
    console.error("Error deleting merchant:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
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
      <UiDropdownMenuItem @click="viewCustomerDetail(row.original.merchantId)"
        >View</UiDropdownMenuItem
      >
      <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem
        @click="deleteMerchants(row.original.id)"
        class="text-red-600"
      >
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
