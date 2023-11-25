<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
import { computed } from "vue";
// import { type Task } from "../data/schema";

import DataTableViewOptions from "./DataTableViewOptions.vue";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const props = defineProps<DataTableToolbarProps<any>>();
const showOtherFilteration = ref(false);
// const isFiltered = computed(
//   () => props.table.getState().columnFilters.length > 0
// );
</script>

<template>
  <div class="flex pt-10 gap-10 w-full mb-10 h-full justify-between">
    <div class="space-y-4 w-full">
      <div class="flex items-center self-start gap-4">
        <UiInput
          placeholder="Search by username, From/To account"
          :model-value="(table.getColumn('userName')?.getFilterValue() as string) ?? ''"
          class="h-10 w-[150px] lg:w-[350px]"
          @input="
            table.getColumn('userName')?.setFilterValue($event.target.value)
          "
        />
        <Icon
          @click="($event) => (showOtherFilteration = !showOtherFilteration)"
          name="material-symbols:filter-list"
          class="h-8 w-8"
        ></Icon>
      </div>

      <div
        v-if="showOtherFilteration"
        class="space-y-6 shadow-lg p-10 border-[1px]"
      >
        <h1 class="text-xl text-left font-semibold text-primary">
          Filter Data By
        </h1>
        <div class="grid grid-cols-3 items-center gap-7">
          <div class="space-y-2">
            <label for="activityType">Activity Type</label>
            <UiSelect
              id="activityType"
              :model-value="(table.getColumn('activityType')?.getFilterValue() as string) ?? ''"
              class="h-10 w-[150px] lg:w-[250px]"
              @input="
                table
                  .getColumn('activityType')
                  ?.setFilterValue($event.target.value)
              "
            >
              <UiSelectTrigger class="w-[180px]">
                <UiSelectValue placeholder="Activity Type" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem value="n/a">N/A </UiSelectItem>
                  <UiSelectItem value="Activity1">Activity1 </UiSelectItem>
                  <UiSelectItem value="Activity2">Activity2 </UiSelectItem>
                </UiSelectGroup>
              </UiSelectContent>
            </UiSelect>
          </div>

          <div class="space-y-2">
            <label for="date">Date</label>
            <UiInput
              id="date"
              placeholder="Date"
              :model-value="(table.getColumn('dataAndTime')?.getFilterValue() as string) ?? ''"
              class="h-10 w-[150px] lg:w-[250px]"
              @input="
                table
                  .getColumn('dataAndTime')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>

          <div class="space-y-2">
            <label for="amount">Amount</label>
            <UiInput
              id="amount"
              placeholder="Amount"
              :model-value="(table.getColumn('amount')?.getFilterValue() as string) ?? ''"
              class="h-10 w-[150px] lg:w-[250px]"
              @input="
                table.getColumn('amount')?.setFilterValue($event.target.value)
              "
            />
          </div>
        </div>
      </div>
    </div>

    <DataTableViewOptions :table="table" />
  </div>
</template>
