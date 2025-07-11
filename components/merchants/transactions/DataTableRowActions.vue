<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { PermissionConstants } from "~/constants/permissions";
const route = useRoute();

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();

function viewMerchantTransactionDetail(id: string) {
  navigateTo(`${route.path}?activeTab=transactionDetails&transactionId=${id}`);
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
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT">
        <UiDropdownMenuItem
          @click="viewMerchantTransactionDetail(row.original.merchantTransactionId)"
          >View Transaction
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
