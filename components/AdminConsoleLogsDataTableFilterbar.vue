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
        class="space-y-6 shadow-lg w-full p-5 lg:p-10 border-[1px]"
      >
        <h1 class="text-xl text-left font-semibold text-primary">
          Filter Data By
        </h1>
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full items-center gap-7"
        >
          <div class="space-y-2">
            <label for="moduleName">Module Name</label>
            <UiSelect
              id="moduleName"
              :model-value="(table.getColumn('module')?.getFilterValue() as string) ?? ''"
              class="h-10 w-full md:w-[150px] lg:w-[250px]"
              @input="
                table.getColumn('module')?.setFilterValue($event.target.value)
              "
            >
              <UiSelectTrigger class="md:w-[180px]">
                <UiSelectValue placeholder="Activity Type" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectGroup>
                  <UiSelectItem value="all">All </UiSelectItem>
                  <UiSelectItem value="Alerts Management"
                    >Alerts Management
                  </UiSelectItem>
                  <UiSelectItem value="Branch and ATM Location Management"
                    >Branch and ATM Location Management
                  </UiSelectItem>
                  <UiSelectItem value="Business Configuration"
                    >Business Configuration
                  </UiSelectItem>
                  <UiSelectItem value="Business Type"
                    >Business Type
                  </UiSelectItem>
                  <UiSelectItem value="Campaign Management"
                    >Campaign Management
                  </UiSelectItem>
                  <UiSelectItem value="Company">Company </UiSelectItem>
                  <UiSelectItem value="Configurations Framework"
                    >Configurations Framework
                  </UiSelectItem>
                  <UiSelectItem value="Contracts">Contracts </UiSelectItem>
                  <UiSelectItem value="Credential Policies"
                    >Credential Policies
                  </UiSelectItem>
                  <UiSelectItem value="Customer Care Information"
                    >Customer Care Information
                  </UiSelectItem>
                  <UiSelectItem value="Customer Management"
                    >Customer Management
                  </UiSelectItem>
                  <UiSelectItem value="Customer Requests and Messages"
                    >Customer Requests and Messages
                  </UiSelectItem>
                  <UiSelectItem value="Customer Roles"
                    >Customer Roles
                  </UiSelectItem>
                  <UiSelectItem value="Feature Management"
                    >Feature Management
                  </UiSelectItem>
                  <UiSelectItem value="Frequently Asked Questions"
                    >Frequently Asked Questions
                  </UiSelectItem>
                  <UiSelectItem value="Infinity User"
                    >Infinity User
                  </UiSelectItem>
                  <UiSelectItem value="Internal Users Management"
                    >Internal Users Management
                  </UiSelectItem>
                  <UiSelectItem value="Lead Management"
                    >Lead Management
                  </UiSelectItem>
                  <UiSelectItem value="Login">Login </UiSelectItem>
                  <UiSelectItem value="MFA Configurations"
                    >MFA Configurations
                  </UiSelectItem>
                  <UiSelectItem value="MFA Scenarios"
                    >MFA Scenarios
                  </UiSelectItem>
                  <UiSelectItem value="Password Settings"
                    >Password Settings
                  </UiSelectItem>
                  <UiSelectItem value="Periodic Limits"
                    >Periodic Limits
                  </UiSelectItem>
                  <UiSelectItem value="Permissions Management"
                    >Permissions Management
                  </UiSelectItem>
                  <UiSelectItem value="Privacy Policies"
                    >Privacy Policies
                  </UiSelectItem>
                  <UiSelectItem value="Role Management"
                    >Role Management
                  </UiSelectItem>
                  <UiSelectItem value="Security Questions"
                    >Security Questions
                  </UiSelectItem>
                  <UiSelectItem value="Service Management"
                    >Service Management
                  </UiSelectItem>
                  <UiSelectItem value="Service Definition"
                    >Service Definition
                  </UiSelectItem>
                  <UiSelectItem value="Service Outage Messages"
                    >Service Outage Messages
                  </UiSelectItem>
                  <UiSelectItem value="Terms and Conditions"
                    >Terms and Conditions
                  </UiSelectItem>
                  <UiSelectItem value="Travel Notification"
                    >Travel Notification
                  </UiSelectItem>
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
              class="h-10 w-full md:w-[150px] lg:w-[250px]"
              @input="
                table
                  .getColumn('dataAndTime')
                  ?.setFilterValue($event.target.value)
              "
            />
          </div>
        </div>
      </div>
    </div>

    <DataTableViewOptions :table="table" />
  </div>
</template>
