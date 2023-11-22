<script setup lang="ts">
import type { Column } from "@tanstack/vue-table";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "lucide-vue-next";
import { ArrowUpIcon } from "lucide-vue-next";

interface DataTableColumnHeaderProps<TData> {
  column: Column<TData, any>;
  title: string;
}

defineProps<DataTableColumnHeaderProps<any>>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
  components: { ArrowDownIcon, ArrowUpIcon },
};
</script>

<template>
  <div
    v-if="column.getCanSort()"
    :class="cn('flex items-center  space-x-2 ', $attrs.class ?? '')"
  >
    <UiDropdownMenu>
      <UiDropdownMenuTrigger as-child>
        <UiButton
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <ArrowDownIcon
            v-if="column.getIsSorted() === 'desc'"
            class="ml-2 h-4 w-4"
          />
          <ArrowUpIcon
            v-else-if="column.getIsSorted() === 'asc'"
            class="ml-2 h-4 w-4"
          />
          <Icon
            name="radix-icons:caret-sort"
            v-else
            class="ml-2 h-4 w-4"
          ></Icon>
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent align="start">
        <UiDropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUpIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </UiDropdownMenuItem>
        <UiDropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDownIcon class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="column.toggleVisibility(false)">
          <Icon
            name="streamline:invisible-1"
            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
          ></Icon>

          Hide
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
