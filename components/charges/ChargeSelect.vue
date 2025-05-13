<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { Charge } from '~/types';

const props = defineProps<{
  modelValue: number | null;
  charges: Charge[];
}>();

const emit = defineEmits(['update:modelValue']);

const selectedCharge = ref<Charge | null>(
  props.charges.find(charge => charge.id === props.modelValue) || null
);

watch(() => props.modelValue, (newValue) => {
  selectedCharge.value = props.charges.find(charge => charge.id === newValue) || null;
});

const handleSelect = (charge: Charge) => {
  selectedCharge.value = charge;
  emit('update:modelValue', charge.id);
};
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger asChild>
      <FormControl>
        <div
          variant="outline"
          role="combobox"
          class="w-full text-sm text-left border flex items-center justify-between px-4 py-2 no-wrap whitespace-nowrap overflow-x-scroll rounded-md"
          :class="{
            'text-muted-foreground': !selectedCharge,
          }"
        >
          {{ selectedCharge ? selectedCharge.chargeCode : "Select a charge" }}
          <Icon
            name="material-symbols:unfold-more-rounded"
            class="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </div>
      </FormControl>
    </UiPopoverTrigger>
    <UiPopoverContent class="w-full self-start p-0">
      <UiCommand>
        <UiCommandInput placeholder="Search charges..." />
        <UiCommandList>
          <UiCommandEmpty>No charges found.</UiCommandEmpty>
          <UiCommandGroup>
            <UiCommandItem
              v-for="charge in charges"
              :key="charge.id"
              :value="charge.chargeCode"
              @select="() => handleSelect(charge)"
            >
              {{ charge.chargeCode }}
              <UiCheckbox
                :checked="selectedCharge?.id === charge.id"
                class="ml-auto"
              />
            </UiCommandItem>
          </UiCommandGroup>
        </UiCommandList>
      </UiCommand>
    </UiPopoverContent>
  </UiPopover>
</template> 