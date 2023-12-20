<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
import { computed } from "vue";
// import { type Task } from "../data/schema";

import DataTableViewOptions from "./DataTableViewOptions.vue";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const props = defineProps<DataTableToolbarProps<any>>();

const hideAdvancedSearch = ref<boolean>(true);
const customerPhone = ref();

const clearAllFilters = () => {
  const columnKeys = [
    "customerPhone",
    "email",
    "userId",
    "customerId",
    "customerName",
    "accountNumber",
    "identification",
    // Add other column keys here if needed
  ];

  columnKeys.forEach((key) => {
    const column = props.table.getColumn(key);
    if (column) {
      column.setFilterValue("");
    }
  });
};

// const isFiltered = computed(
//   () => props.table.getState().columnFilters.length > 0
// );
</script>

<template>
  <div
    class="flex flex-col gap-6 w-full shadow-lg p-4 md:p-6 border-[1px] mb-10 h-full justify-between"
  >
    <h1 class="text-xl text-left  text-primary pb-2">
      Search Customer By
    </h1>
    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-6"
    >
      <UiInput
        placeholder="Phone Number"
        :model-value="(table.getColumn('customerPhone')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="
          table.getColumn('customerPhone')?.setFilterValue($event.target.value)
        "
        ref="customerPhone"
      />
      <UiInput
        placeholder="Email"
        :model-value="(table.getColumn('email')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="table.getColumn('email')?.setFilterValue($event.target.value)"
      />
      <UiInput
        placeholder="User ID"
        :model-value="(table.getColumn('userId')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="table.getColumn('userId')?.setFilterValue($event.target.value)"
      />
    </div>
    <div
      class="flex items-center gap-1"
      :class="{ hidden: !hideAdvancedSearch }"
      @click="($event) => (hideAdvancedSearch = false)"
    >
      <p class="text-primary text-sm">ADVANCED SEARCH</p>
      <Icon
        name="mdi:chevron-right"
        class="w-6 h-6 text-muted-foreground"
      ></Icon>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-6"
      :class="{ hidden: hideAdvancedSearch }"
    >
      <UiInput
        placeholder="Customer ID"
        :model-value="(table.getColumn('customerId')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="
          table.getColumn('customerId')?.setFilterValue($event.target.value)
        "
      />
      <UiInput
        placeholder="Customer Name"
        :model-value="(table.getColumn('customerName')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="
          table.getColumn('customerName')?.setFilterValue($event.target.value)
        "
      />
      <UiInput
        placeholder="Account Number"
        :model-value="(table.getColumn('accountNumber')?.getFilterValue() as string) ?? ''"
        class="h-10 md:w-[150px] lg:w-full"
        @input="
          table.getColumn('accountNumber')?.setFilterValue($event.target.value)
        "
      />
      <div class="flex">
        <UiSelect class="border-4">
          <UiSelectTrigger class="md:w-[180px] bg-gray-100">
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
            class="h-10 mg:w-[150px] lg:w-[250px]"
            @input="
              table
                .getColumn('identification')
                ?.setFilterValue($event.target.value)
            "
          />
        </UiSelect>
      </div>
    </div>
    <div
      class="flex items-center gap-1"
      :class="{ hidden: hideAdvancedSearch }"
      @click="($event) => (hideAdvancedSearch = true)"
    >
      <p class="text-primary text-sm">HIDE ADVANCED SEARCH</p>
      <Icon
        name="mdi:chevron-down"
        class="w-6 h-6 text-muted-foreground"
      ></Icon>
    </div>
    <UiButton
      class="w-fit px-10 rounded-lg border-[1px] border-primary"
      variant="outline"
      @click="clearAllFilters"
      >Clear All</UiButton
    >
  </div>
  <DataTableViewOptions :table="table" />
</template>
