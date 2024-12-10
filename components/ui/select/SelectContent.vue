<script setup lang="ts">
import {
  SelectContent,
  type SelectContentEmits,
  type SelectContentProps,
  SelectPortal,
  SelectViewport,
  useForwardPropsEmits,
} from "radix-vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<SelectContentProps & { class?: string }>(),
  {
    position: "popper",
    sideOffset: 4,
  }
);
const emits = defineEmits<SelectContentEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'relative z-[999] min-w-[10rem] overflow-hidden rounded-md bg-background border text-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          'fixed',
          props.class
        )
      "
    >
      <SelectViewport
        :class="
          cn(
            'p-1',
            'max-h-[var(--radix-select-content-available-height)]',
            position === 'popper' &&
              'w-full min-w-[var(--radix-select-trigger-width)]'
          )
        "
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>

<style>
:root {
  --radix-select-content-available-height: 300px;
}

/* Update available height on mount */
@media screen {
  :root {
    --radix-select-content-available-height: calc(100vh - 2rem);
  }
}
</style>
