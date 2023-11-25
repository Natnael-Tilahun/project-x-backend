<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
// import { type Task } from "../data/schema";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}
defineProps<DataTablePaginationProps<any>>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between px-2"
  >
    <div class="flex-1 self-start text-sm text-muted-foreground">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <UiSelect
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="table.setPageSize"
        >
          <UiSelectTrigger class="h-8 w-[70px]">
            <UiSelectValue
              :placeholder="`${table.getState().pagination.pageSize}`"
            />
          </UiSelectTrigger>
          <UiSelectContent side="top">
            <UiSelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div
        class="flex w-[100px] items-center justify-center text-sm font-medium"
      >
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <UiButton
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <Icon name="radix-icons:double-arrow-left" class="w-4 h-4"></Icon>
        </UiButton>
        <UiButton
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Go to previous page</span>
          <Icon name="radix-icons:chevron-left" class="w-4 h-4"></Icon>
        </UiButton>
        <Button
          variant="outline"
          class="w-8 h-8 p-0"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Go to next page</span>
          <Icon name="radix-icons:chevron-right" class="w-4 h-4"></Icon>
        </Button>
        <Button
          variant="outline"
          class="hidden w-8 h-8 p-0 lg:flex"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <Icon name="radix-icons:double-arrow-right" class="w-4 h-4"></Icon>
        </Button>
      </div>
    </div>
  </div>
</template>
