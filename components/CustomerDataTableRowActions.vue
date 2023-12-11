<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
// import { taskSchema } from "../data/schema";
// import { type Task } from "../data/schema";

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<DataTableRowActionsProps<any>>();

function viewCustomerDetail(id: string) {
  // alert(id);
  navigateTo(`/customers/customerDetails/${id}`);
  navigator.clipboard.writeText(id);
}

// const task = computed(() => taskSchema.parse(props.row.original));
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
      <UiDropdownMenuItem @click="viewCustomerDetail(row.original.customerId)"
        >View</UiDropdownMenuItem
      >
      <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
      <UiDropdownMenuItem>Make a copy</UiDropdownMenuItem>
      <UiDropdownMenuItem>Favorite</UiDropdownMenuItem>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem>
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
