<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
// import { type Task } from "../data/schema";

import DataTableViewOptions from "~/components/ui/dataTable/ViewOptions.vue";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const props = defineProps<DataTableToolbarProps<any>>();
const showOtherFilteration = ref(false);
</script>

<template>
  <div class="flex pt-6 gap-10 w-full mb-8 h-full justify-between">
    <div class="space-y-4 w-full">
      <div class="flex items-center self-start gap-4">
        <UiInput
          placeholder="Search by name"
          :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
          class="h-10 w-[150px] lg:w-[350px]"
          @input="table.getColumn('name')?.setFilterValue($event.target.value)"
        />
        <Icon
          @click="($event) => (showOtherFilteration = !showOtherFilteration)"
          name="material-symbols:filter-list"
          class="h-8 w-8 text-primary"
        ></Icon>
      </div>

      <div
        v-if="showOtherFilteration"
        class="space-y-6 shadow-sm rounded-xl w-full p-5 lg:p-6 border-[1px]"
      >
        <h1 class="text-xl text-left text-primary">Filter Data By</h1>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full items-center gap-6"
        >
          <div class="space-y-2">
            <label for="name">Name</label>
            <UiInput
              id="name"
              placeholder="Firstname"
              :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
              class="h-10 w-full md:w-[150px] lg:w-full"
              @input="
                table.getColumn('name')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <div class="space-y-2">
            <label for="customerId">Customer ID</label>
            <UiInput
              id="customerId"
              placeholder="Customer ID"
              :model-value="(table.getColumn('userId')?.getFilterValue() as string) ?? ''"
              class="h-10 w-full md:w-[150px] lg:w-full"
              @input="
                table.getColumn('userId')?.setFilterValue($event.target.value)
              "
            />
          </div>
          <div class="space-y-2">
            <label for="customerUsername">Customer Username</label>
            <UiInput
              id="customerUsername"
              placeholder="Customer Username"
              :model-value="(table.getColumn('userName')?.getFilterValue() as string) ?? ''"
              class="h-10 w-full md:w-[150px] lg:w-full"
              @input="
                table.getColumn('userName')?.setFilterValue($event.target.value)
              "
            />
          </div>
        </div>
      </div>
    </div>

    <DataTableViewOptions :table="table" />
  </div>
</template>
