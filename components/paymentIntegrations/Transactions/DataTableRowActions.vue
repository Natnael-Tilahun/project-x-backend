<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "~/components/ui/toast";
import { usePaymentOperations } from "~/composables/usePaymentOperations";
import { PermissionConstants } from "~/constants/permissions";

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
      activeTab: "transactionDetails",
      transactionId: id,
    },
  });
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
<UiPermissionGuard :permission="PermissionConstants.READ_PAYMENT_OPERATION" >
      <UiDropdownMenuItem @click="viewIntegrationDetail(row.original.id)"
        >View and Edit</UiDropdownMenuItem
      >
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

</template>
