<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
import { computed } from "vue";
// import { type Task } from "../data/schema";

import DataTableViewOptions from "./DataTableViewOptions.vue";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const props = defineProps<DataTableToolbarProps<any>>();

// const isFiltered = computed(
//   () => props.table.getState().columnFilters.length > 0
// );
</script>

<template>
  <div
    class="flex flex-col gap-10 w-full shadow-lg p-10 border-[1px] mb-10 h-full justify-between"
  >
    <h1 class="text-xl text-left font-semibold text-primary">
      Search Customer By
    </h1>
    <div class="grid grid-cols-3 items-center gap-7">
      <UiInput
        placeholder="Phone Number"
        :model-value="(table.getColumn('customerPhone')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="
          table.getColumn('customerPhone')?.setFilterValue($event.target.value)
        "
      />
      <UiInput
        placeholder="Email"
        :model-value="(table.getColumn('email')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="table.getColumn('email')?.setFilterValue($event.target.value)"
      />
      <UiInput
        placeholder="User ID"
        :model-value="(table.getColumn('userId')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="table.getColumn('userId')?.setFilterValue($event.target.value)"
      />
      <UiInput
        placeholder="Customer ID"
        :model-value="(table.getColumn('customerId')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="
          table.getColumn('customerId')?.setFilterValue($event.target.value)
        "
      />
      <UiInput
        placeholder="Customer Name"
        :model-value="(table.getColumn('customerName')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="
          table.getColumn('customerName')?.setFilterValue($event.target.value)
        "
      />
      <UiInput
        placeholder="Account Number"
        :model-value="(table.getColumn('accountNumber')?.getFilterValue() as string) ?? ''"
        class="h-10 w-[150px] lg:w-[250px]"
        @input="
          table.getColumn('accountNumber')?.setFilterValue($event.target.value)
        "
      />
      <div class="flex">
        <UiSelect class="border-4">
          <UiSelectTrigger class="w-[180px] bg-gray-100">
            <UiSelectValue placeholder="Select Identification" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectGroup>
              <UiSelectItem value="governmentId"> Government ID </UiSelectItem>
              <UiSelectItem value="passport"> Passport </UiSelectItem>
              <UiSelectItem value="driverLicense">
                Driver's License
              </UiSelectItem>
              <UiSelectItem value="studentId"> Student ID </UiSelectItem>
            </UiSelectGroup>
          </UiSelectContent>
          <UiInput
            placeholder="Identification No"
            :model-value="(table.getColumn('identification')?.getFilterValue() as string) ?? ''"
            class="h-10 w-[150px] lg:w-[250px]"
            @input="
              table
                .getColumn('identification')
                ?.setFilterValue($event.target.value)
            "
          />
        </UiSelect>
      </div>
    </div>
  </div>
  <DataTableViewOptions :table="table" />
</template>
