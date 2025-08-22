<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "../ui/toast";
import { PermissionConstants } from "~/constants/permissions";


const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(["accountCategoryDeleted"]);

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
// const props = defineProps<DataTableRowActionsProps<any>>();

function viewAccountCategoryDetail(id: string) {
  navigateTo(`/accountCategories/${id}`);
  navigator.clipboard.writeText(id);
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
      <!-- <UiPermissionGuard :permission="PermissionConstants.READ_ACCOUNT_CATEGORY"> -->
        <UiDropdownMenuItem @click="viewAccountCategoryDetail(row.original.categoryCode)"
          >View</UiDropdownMenuItem
        >
      <!-- </UiPermissionGuard> -->
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
